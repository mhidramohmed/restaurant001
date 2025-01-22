<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  // <-- Import DB facade here

use Illuminate\Support\Facades\Http;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;


class OrderController extends Controller
{

    private $cmiConfig = [
        'clientId' => '600005293',
        'storeKey' => 'TEST1234',
        'paymentUrl' => 'https://testpayment.cmi.co.ma/fim/est3Dgate',
        'currency' => '504', // Moroccan Dirham
        'storeType' => '3D_PAY_HOSTING',
        'tranType' => 'PreAuth',
        'hashAlgorithm' => 'ver3',
        'language' => 'fr'
    ];
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Eager load 'orderElements' and 'menuItem' relationships
            $orders = Order::with('orderElements.menuItem.category')->get();

            // return'sdvv';

            return response()->json(['data' => $orders], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }


    public function totalOrders()
    {
        $totalOrders = Order::getTotalOrders();
        return response()->json(['total_orders' => $totalOrders]);
    }


    public function totalByPaymentMethod()
    {
        $totals = Order::getTotalByPaymentMethod();
        return response()->json($totals);
    }

    public function totalSpentByCustomers()
    {
        $spendingData = Order::getTotalSpentByCustomers();
        return response()->json($spendingData);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     // Begin a database transaction to ensure everything is processed atomically
    //     DB::beginTransaction();

    //     try {
    //         // Validate the incoming request
    //         $validated = $request->validate([
    //             'client_name' => 'required|string|max:255',
    //             'client_email' => 'required|email|max:255',
    //             'client_phone' => 'required|string|max:20',
    //             'client_address' => 'required|string|max:255',
    //             'total_price' => 'required|numeric',
    //             'payment_method' => 'required|string|in:visa,cash',
    //             // 'status' => 'required|string|in:pending,delivered,declined', //shouldent be passed in the request, it have a default value
    //             'order_items' => 'required|array',
    //             'order_items.*.menu_item_id' => 'required|exists:menu_items,id',
    //             'order_items.*.quantity' => 'required|integer|min:1',
    //             'order_items.*.price' => 'required|numeric',
    //             // Conditional validation for Visa payment method
    //             'card_details.card_number' => 'required_if:payment_method,visa|string|digits_between:13,19',
    //             'card_details.card_expiry' => 'required_if:payment_method,visa|date_format:m/y',
    //             'card_details.card_cvv' => 'required_if:payment_method,visa|string|digits:3',
    //         ]);

    //         // Create the order
    //         $order = Order::create([
    //             'client_name' => $validated['client_name'],
    //             'client_email' => $validated['client_email'],
    //             'client_phone' => $validated['client_phone'],
    //             'client_address' => $validated['client_address'],
    //             'total_price' => $validated['total_price'],
    //             'payment_method' => $validated['payment_method'],
    //             // 'status' => $validated['status'], //default value
    //         ]);


    //         // If payment method is Visa, process payment details (optional step)
    //         if ($validated['payment_method'] === 'visa') {
    //             // Here you would typically integrate with a payment gateway.
    //             // For demonstration, we'll just log the card details.
    //             // NEVER store raw card details in your database.
    //             // This is just a placeholder to show how you might handle it.
    //             $cardDetails = $validated['card_details'];
    //             // Log or process the card details as needed
    //             // Integrate with your payment gateway here using $cardDetails
    //             // Example:
    //             // $paymentResult = PaymentGateway::charge($cardDetails, $order->total_price);
    //             // if (!$paymentResult->success) {
    //             //     throw new \Exception('Payment failed: ' . $paymentResult->message);
    //             // }
    //         }


    //         // Loop through the order items and create each OrderElement
    //         foreach ($validated['order_items'] as $orderItem) {

    //             // Fetch the menu item name using the menu_item_id
    //             $menu_item = MenuItem::find($orderItem['menu_item_id']);
    //             $item_name = $menu_item ? $menu_item->name : 'Unknown';

    //             $order->orderElements()->create([
    //                 'menu_item_id' => $orderItem['menu_item_id'],
    //                 'name' => $item_name,
    //                 'quantity' => $orderItem['quantity'],
    //                 'price' => $orderItem['price'],
    //             ]);
    //         }

    //         // Commit the transaction
    //         DB::commit();

    //         // Return a success response
    //         return response()->json(['message' => 'Order and OrderElements created successfully'], 201);

    //     } catch (\Throwable $th) {
    //         // Rollback the transaction in case of error
    //         DB::rollBack();

    //         // Return an error response
    //         return response()->json([
    //             'error' => 'Failed to create the order',
    //             'details' => $th->getMessage()  // Optional for debugging
    //         ], 500);
    //     }
    // }

    /**
     * Display the specified resource.
     */
    public function show($id )
    {
        // return($id);
        try {
            $order = Order::find($id);
            if($order){

                return response()->json(['data'=>$order], 200);

            }else{

                return response()->json([
                    'messsage'=>"Your Order doesn't exist  "
                ], 404);

            }
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to fetch your order'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  $id)
    {
        try {
            $order = Order::find($id);

            // return($order);

            if(!$order){
                return response()->json(['message' => "Your Order doesn't exist"], 200);


            }else{
                $data = $request->validate([
                    'client_name' => 'sometimes|string|max:255',
                    'client_email' => 'sometimes|email|max:255',
                    'client_phone' => 'sometimes|string|max:20',
                    'client_address' => 'sometimes|string|max:255',
                    'total_price' => 'sometimes|numeric',
                    'payment_method' => 'sometimes|string|in:paypal,cash',
                    'order_status' => 'sometimes|string|in:pending,inprocess,delivered,declined',
                    'payment_status' => 'sometimes|string|in:paid,unpaid',

                ]);

                $order->update($data);

                return response()->json(['messsage'=>"the Order  has been updated successfully  "], 201);

            }

        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to update Order'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $order = Order::find($id);



            if(!$order){
                return response()->json(['message' => "Your Order doesn't exist"], 404);


            }else{
                $order->delete();

                return response()->json(['messsage'=>"the Order  has been deleted successfully  "], 201);

            }

        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to delete  Order'], 500);
        }
    }





//test01
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validate the incoming request
            $validated = $request->validate([
                'client_name' => 'required|string|max:255',
                'client_email' => 'required|email|max:255',
                'client_phone' => 'required|string|max:20',
                'client_address' => 'required|string|max:255',
                'total_price' => 'required|numeric',
                'payment_method' => 'required|string|in:visa,cash,stripe', // Add stripe
                'order_items' => 'required|array',
                'order_items.*.menu_item_id' => 'required|exists:menu_items,id',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.price' => 'required|numeric',
            ]);


            $order = Order::create([
                'client_name' => $validated['client_name'],
                'client_email' => $validated['client_email'],
                'client_phone' => $validated['client_phone'],
                'client_address' => $validated['client_address'],
                'total_price' => $validated['total_price'],
                'payment_method' => $validated['payment_method'],
                'order_status' => 'pending',
                'payment_status' => 'unpaid'
            ]);

            foreach ($validated['order_items'] as $orderItem) {
                $menu_item = MenuItem::find($orderItem['menu_item_id']);
                $item_name = $menu_item ? $menu_item->name : 'Unknown';

                $order->orderElements()->create([
                    'menu_item_id' => $orderItem['menu_item_id'],
                    'name' => $item_name,
                    'quantity' => $orderItem['quantity'],
                    'price' => $orderItem['price'],
                ]);
            }

            if ($validated['payment_method'] === 'visa') {
                // Payment gateway configuration
                $storeKey = "TEST1234"; // Replace with your actual store key
                $paymentUrl = "https://testpayment.cmi.co.ma/fim/est3Dgate"; // Replace with the actual payment gateway URL


                // Prepare payment data
                $paymentData = [
                    'clientid' => "600005293",// Replace with your actual client ID
                    'storetype' => "3D_PAY_HOSTING",
                    'storeKey' => "TEST1234",
                    'TranType' => "PreAuth",
                    'amount' => $validated['total_price'],
                    'currency' => "504", // Replace with your currency code
                    'oid' => $order->id, // Use the order ID as the unique transaction ID
                    'okUrl' => route('payment.success'), // Replace with your success URL
                    'failUrl' => route('payment.fail'), // Replace with your failure URL
                    'callbackUrl' => route('payment.callback'), // Replace with your callback URL
                    'rnd' => microtime(),
                    'hashAlgorithm' => "ver3",
                    'lang' => "fr",
                    'shopurl' => config('app.url'), // Replace with your shop URL


                ];

                // Generate hash
                $hashval = "";
                foreach ($paymentData as $key => $value) {
                    $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $value));
                    $hashval .= $escapedValue . "|";
                }
                $hashval .= $storeKey;

                $calculatedHashValue = hash('sha512', $hashval);
                $hash = base64_encode(pack('H*', $calculatedHashValue));

                // dd($hash);

                // Add hash to payment data
                $paymentData['HASH'] = $hash;

                DB::commit();


                return response()->json([
                        'success' => true,
                        'redirect_url' => $paymentUrl,
                        'payment_data' => $paymentData,
                ], 201);

                // Send payment request to the gateway
                // $response = Http::asForm()->post($paymentUrl, $paymentData);

                // Handle payment response

            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            // Log::error('Order Creation Error: ' . $th->getMessage());

            return response()->json([
                'error' => 'Failed to create the order',
                'details' => $th->getMessage()
            ], 500);
        }
    }

    public function paymentSuccess(Request $request)
    {
        // Handle successful payment
        $order = Order::find($request->oid);
        if ($order) {
            $order->update(['payment_status' => 'paid']);
        }
            $message = 'Payment successful';
            return redirect()->away(env('FRONTEND_URL') . '/?message=' . urlencode($message));
    }

    public function paymentFail(Request $request)
    {
        // Handle failed payment
        $order = Order::find($request->oid);
        // if ($order) {
        //     $order->update(['payment_status' => 'failed']);
        // }
            $message = 'Payment Fail';
            return redirect()->away(env('FRONTEND_URL') . '/?message=' . urlencode($message));

        // return response()->json(['message' => 'Payment failed']);
    }

    public function paymentCallback(Request $request)
    {
        // Handle payment callback (e.g., verify hash, update order status)
        $storeKey = "TEST1234"; // Replace with your actual store key
        $hashval = "";

        foreach ($request->except('HASH') as $key => $value) {
            $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $value));
            $hashval .= $escapedValue . "|";
        }
        $hashval .= $storeKey;

        $calculatedHashValue = hash('sha512', $hashval);
        $actualHash = base64_encode(pack('H*', $calculatedHashValue));

        if ($request->HASH === $actualHash) {
            $order = Order::find($request->oid);
            if ($order) {
                $order->update(['payment_status' => 'paid']);
            }
            return response()->json(['message' => 'Callback handled successfully']);
        } else {
            return response()->json(['error' => 'Invalid hash'], 400);
        }
    }
//=====================================================------------------
    //test02

    // private $cmiConfig = [
    //     'clientId' => '600005293',
    //     'storeKey' => 'TEST1234',
    //     'paymentUrl' => 'https://testpayment.cmi.co.ma/fim/est3Dgate',
    //     'currency' => '504', // Moroccan Dirham
    //     'storeType' => '3D_PAY_HOSTING',
    //     'tranType' => 'PreAuth',
    //     'hashAlgorithm' => 'ver3',
    //     'language' => 'fr'
    // ];

    // public function store(Request $request)
    // {
    //     DB::beginTransaction();

    //     try {
    //         // Validate the incoming request
    //         $validated = $request->validate([
    //             'client_name' => 'required|string|max:255',
    //             'client_email' => 'required|email|max:255',
    //             'client_phone' => 'required|string|max:20',
    //             'client_address' => 'required|string|max:255',
    //             'total_price' => 'required|numeric',
    //             'payment_method' => 'required|string|in:visa,cash',
    //             'order_items' => 'required|array',
    //             'order_items.*.menu_item_id' => 'required|exists:menu_items,id',
    //             'order_items.*.quantity' => 'required|integer|min:1',
    //             'order_items.*.price' => 'required|numeric',
    //         ]);

    //         // Create the order
    //         $order = Order::create([
    //             'client_name' => $validated['client_name'],
    //             'client_email' => $validated['client_email'],
    //             'client_phone' => $validated['client_phone'],
    //             'client_address' => $validated['client_address'],
    //             'total_price' => $validated['total_price'],
    //             'payment_method' => $validated['payment_method'],
    //             'order_status' => 'pending',
    //             'payment_status' => 'unpaid'
    //         ]);

    //         // Create order elements
    //         foreach ($validated['order_items'] as $orderItem) {
    //             $menu_item = MenuItem::find($orderItem['menu_item_id']);
    //             $item_name = $menu_item ? $menu_item->name : 'Unknown';

    //             $order->orderElements()->create([
    //                 'menu_item_id' => $orderItem['menu_item_id'],
    //                 'name' => $item_name,
    //                 'quantity' => $orderItem['quantity'],
    //                 'price' => $orderItem['price'],
    //             ]);
    //         }

    //         if ($validated['payment_method'] === 'visa') {
    //             $paymentData = $this->prepareCmiPaymentData($order, $validated);
    //             $paymentData['HASH'] = $this->generateCmiHash($paymentData);

    //             DB::commit();

    //             return response()->json([
    //                 'success' => true,
    //                 'message' => 'Order created successfully',
    //                 'payment_url' => $this->cmiConfig['paymentUrl'],
    //                 'payment_data' => $paymentData,
    //                 'order_id' => $order->id
    //             ], 201);
    //         }

    //         DB::commit();
    //         return response()->json(['message' => 'Order created successfully'], 201);

    //     } catch (\Throwable $th) {
    //         DB::rollBack();
    //         return response()->json([
    //             'error' => 'Failed to create the order',
    //             'details' => $th->getMessage()
    //         ], 500);
    //     }
    // }

    // private function prepareCmiPaymentData(Order $order, array $validated)
    // {
    //     return [
    //         'clientid' => $this->cmiConfig['clientId'],
    //         'storetype' => $this->cmiConfig['storeType'],
    //         'TranType' => $this->cmiConfig['tranType'],
    //         'amount' => number_format($validated['total_price'], 2, '.', ''),
    //         'currency' => $this->cmiConfig['currency'],
    //         'oid' => $order->id,
    //         'okUrl' => route('payment.success'),
    //         'failUrl' => route('payment.fail'),
    //         'callbackUrl' => route('payment.callback'),
    //         'rnd' => microtime(),
    //         'hashAlgorithm' => $this->cmiConfig['hashAlgorithm'],
    //         // 'lang' => $this->cmiConfig['language'],
    //         // 'BillToName' => $validated['client_name'],
    //         // 'BillToStreet1' => $validated['client_address'],
    //         // 'email' => $validated['client_email'],
    //         // 'tel' => $validated['client_phone'],
    //         // 'encoding' => 'UTF-8',
    //         'shopurl' => config('app.url')
    //     ];
    // }

    // private function generateCmiHash(array $paymentData)
    // {
    //     $hashval = '';
    //     ksort($paymentData); // Sort parameters alphabetically

    //     foreach ($paymentData as $key => $value) {
    //         $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $value));
    //         $hashval .= $escapedValue . '|';
    //     }

    //     $hashval .= $this->cmiConfig['storeKey'];
    //     $calculatedHashValue = hash('sha512', $hashval);
    //     return base64_encode(pack('H*', $calculatedHashValue));
    // }

    // public function paymentCallback(Request $request)
    // {
    //     try {
    //         $receivedHash = $request->input('HASH');
    //         $parameterArray = $request->except(['HASH', 'encoding']);

    //         // Recreate hash for validation
    //         $hashval = '';
    //         ksort($parameterArray);

    //         foreach ($parameterArray as $value) {
    //             $value = html_entity_decode(preg_replace("/\n$/", "", $value), ENT_QUOTES, 'UTF-8');
    //             $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $value));
    //             $hashval .= $escapedValue . '|';
    //         }

    //         $hashval .= $this->cmiConfig['storeKey'];
    //         $calculatedHashValue = hash('sha512', $hashval);
    //         $calculatedHash = base64_encode(pack('H*', $calculatedHashValue));

    //         if ($receivedHash === $calculatedHash) {
    //             $order = Order::find($request->input('oid'));

    //             if ($order) {
    //                 if ($request->input('ProcReturnCode') === '00') {
    //                     $order->update([
    //                         'payment_status' => 'paid',
    //                         'order_status' => 'processing'
    //                     ]);
    //                     return "ACTION=POSTAUTH";
    //                 }
    //                 return "APPROVED";
    //             }
    //         }
    //         return "FAILURE";

    //     } catch (\Throwable $th) {
    //         return "FAILURE";
    //     }
    // }

    //   public function paymentSuccess(Request $request)
    // {
    //     // Handle successful payment
    //     $order = Order::find($request->oid);
    //     if ($order) {
    //         $order->update(['payment_status' => 'paid']);
    //     }
    //     return response()->json(['message' => 'Payment successful']);
    // }

    // public function paymentFail(Request $request)
    // {
    //     // Handle failed payment
    //     $order = Order::find($request->oid);
    //     if ($order) {
    //         $order->update(['payment_status' => 'failed']);
    //     }
    //     return response()->json(['message' => 'Payment failed']);
    // }

}
