<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  // <-- Import DB facade here

use Illuminate\Support\Facades\Http;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Facades\Log;



class OrderController extends Controller
{
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
                'client_phone' =>  ['required','string','regex:/^(05|06|07)[0-9]{8}$/',],
                'client_address' => 'required|string|max:255',
                'total_price' => 'required|numeric',
                'payment_method' => 'required|string|in:visa,cash', // Add stripe
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
                $storeKey = env("CMI_STORE_KEY"); // Replace with your actual store key
                $paymentUrl = env("CMI_PAYMENT_URL"); // Replace with the actual payment gateway URL


                // Prepare payment data
                $paymentData = [
                    'amount' => $validated['total_price'], // Transaction amount
                    'BillToCity' => 'Marrakech', // New field
                    'BillToName' => $validated['client_name'], // New field
                    'BillToStreet1' => $validated['client_address'],
                    'callbackUrl' => route('payment.callback'), // Callback URL
                    'clientid' => env("CMI_CLIENT_ID"), // Replace with your actual client ID
                    'currency' => "504", // Currency code
                    'email' => $validated['client_email'],
                    'encoding' => "UTF-8",
                    'failUrl' => route('payment.fail'), // Failure URL
                    'hashAlgorithm' => "ver3", // Hash algorithm
                    'lang' => "fr", // Language
                    'oid' => $order->id,
                    'okurl' => route('payment.success'),// Success URL
                    'rnd' => microtime(), // Random value
                    'shopurl' => config('app.url'),
                    'storetype' => "3D_PAY_HOSTING",// Store type
                    'tel' => $validated['client_phone'],
                    'TranType' => "PreAuth", // Transaction type
                ];

                // Generate hash
                $hashval = "";
                foreach ($paymentData as $key => $value) {
                    $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $value));
                    $lowerParam = strtolower($key);

                    if ($lowerParam != 'hash' && $lowerParam != 'encoding') {

                        $hashval = $hashval . $escapedValue . '|';

                    }   
                    // $hashval .= $escapedValue . "|";

                    
                }
                $hashval .= $storeKey;



                $calculatedHashValue = hash('sha512', $hashval);
                $hash = base64_encode(pack('H*', $calculatedHashValue));

                // Log the hash for debugging purposes
                Log::info("Generated Payment Hash for Order {$order->id}: {$hash}");



                // Add hash to payment data
                $paymentData['HASH'] = $hash;


                

                // dd($paymentData);


                // $hashval = '';
                // foreach ($paymentData as $key) {
                //     $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $paymentData[$key] ?? ''));
                //     $hashval .= $escapedValue . "|";
                // }

                // // Append the storeKey to the hash string
                // $hashval .= str_replace("|", "\\|", str_replace("\\", "\\\\", $storeKey));

                // // Generate the hash
                // $calculatedHashValue = hash('sha512', $hashval);
                // $hash = base64_encode(pack('H*', $calculatedHashValue));

                // // Add the hash to the payment data
                // $paymentData['HASH'] = $hash;

                DB::commit();

                return response()->json([
                        'success' => true,
                        'order'=>$order,
                        'redirect_url' => $paymentUrl,
                        'payment_data' => $paymentData,
                ], 201);

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
        $message = 'Payment Success';
        return redirect()->away(env('FRONTEND_URL') . '/?message=' . urlencode($message));
    }

    public function paymentFail(Request $request)
    {
        // Handle failed payment
        $order = Order::find($request->oid);
        if ($order) {
            $order->update(['payment_status' => 'failed']);
        }
            $message = 'Payment Fail';
            return redirect()->away(env('FRONTEND_URL') . '/?message=' . urlencode($message));

        // return response()->json(['message' => 'Payment failed']);
    }


    public function paymentCallback(Request $request)
    {
        Log::info("data:", $request->all());

        // Fetch store key from environment
        $storeKey = env('CMI_STORE_KEY', 'Bonsai2025'); // Ensure this is defined in your .env file

        // Initialize variables
        $postParams = [];
        $hashval = "";

        // Collect all POST parameters
        foreach ($request->all() as $key => $value) {
            array_push($postParams, $key);
        }

        // Sort parameters naturally (case-insensitive)
        natcasesort($postParams);

        // Construct hash string
        foreach ($postParams as $param) {
            $paramValue = html_entity_decode(preg_replace("/\n$/", "", $request->post($param)), ENT_QUOTES, 'UTF-8');
            $escapedParamValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $paramValue));

            // Exclude 'hash' and 'encoding' parameters
            $lowerParam = strtolower($param);
            if ($lowerParam != "hash" && $lowerParam != "encoding") {
                $hashval .= $escapedParamValue . "|";
            }
        }

        // Add store key to hash string
        $escapedStoreKey = str_replace("|", "\\|", str_replace("\\", "\\\\", $storeKey));
        $hashval .= $escapedStoreKey;

        // Calculate hash
        $calculatedHashValue = hash('sha512', $hashval);
        $actualHash = base64_encode(pack('H*', $calculatedHashValue));

        // Retrieve necessary parameters directly from POST
        $retrievedHash = $request->post('HASH'); // Directly access the 'HASH' field
        $orderId = $request->post('oid'); // Directly access the 'oid' field
        $procReturnCode = $request->post('ProcReturnCode'); // Directly access 'ProcReturnCode'
        $amount = $request->post('amount'); // Directly access 'amount'

        // Hash comparison and payment processing
        if ($retrievedHash === $actualHash) {
            // Look up the order by ID
            $order = Order::find($orderId);

            if (!$order) {
                // Log error if order is not found
                Log::error("Order not found: ID {$orderId}");
                return response()->json(['status' => 'FAILURE'], 404);
            }

            if ($procReturnCode === "00") {
                // Check if the order amount matches the callback amount
                if ($order->total_price == $amount) {
                    // Update order status to "paid"
                    $order->update(['payment_status' => 'paid']);
                    Log::info("Payment successful for Order {$orderId}");
                    return response("ACTION=POSTAUTH", 200); // Auto-debit client
                } else {
                    // Log warning for amount mismatch
                    Log::warning("Amount mismatch for Order {$orderId}");
                    return response("FAILURE", 400); // Respond with failure
                }
            } else {
                // Log info for failed payment
                Log::info("Payment failed for Order {$orderId}");
                return response("APPROVED", 200); // Acknowledge failure
            }
        } else {
            // Log error for hash validation failure
            Log::error("Hash validation failed for Order {$orderId}");
            return response("FAILURE", 400); // Respond with failure
        }
    }
    // public function paymentCallback(Request $request)
    // {
    //     try {
    //         Log::info("Payment Callback Received", $request->all());

    //         $storeKey = env('CMI_STORE_KEY'); // Ensure this is in your .env file
    //         if (!$storeKey) {
    //             Log::error("CMI_STORE_KEY is missing from environment variables.");
    //             return response("FAILURE", 500);
    //         }

    //         $hashVal = "";
    //         $postParams = $request->except(['HASH', 'encoding']);
    //         ksort($postParams);

    //         foreach ($postParams as $key => $value) {
    //             $cleanValue = preg_replace('/[^A-Za-z0-9 ]/', '', trim($value)); // Remove special characters
    //             $escapedValue = str_replace("|", "\\|", str_replace("\\", "\\\\", $cleanValue));
    //             $hashVal .= $escapedValue . "|";
    //         }

    //         $escapedStoreKey = str_replace("|", "\\|", str_replace("\\", "\\\\", $storeKey));
    //         $hashVal .= $escapedStoreKey;

    //         $calculatedHashValue = hash('sha512', $hashVal);
    //         $actualHash = base64_encode(pack('H*', $calculatedHashValue));

    //         $retrievedHash = $request->input("HASH");
    //         $orderId = $request->input("oid");
    //         $procReturnCode = $request->input("ProcReturnCode");
    //         $amount = $request->input("amount");

    //         Log::info("Calculated Hash: $actualHash | Received Hash: $retrievedHash");

    //         if ($retrievedHash === $actualHash) {
    //             $order = Order::find($orderId);

    //             if (!$order) {
    //                 Log::error("Order not found: ID {$orderId}");
    //                 return response("FAILURE", 404);
    //             }

    //             if ($procReturnCode === "00") {
    //                 if ($order->total_price == $amount) {
    //                     $order->update(['payment_status' => 'paid']);
    //                     Log::info("Payment successful for Order {$orderId}");
    //                     return response("ACTION=POSTAUTH", 200);
    //                 } else {
    //                     Log::warning("Amount mismatch for Order {$orderId}");
    //                     return response("FAILURE", 400);
    //                 }
    //             } else {
    //                 Log::info("Payment failed for Order {$orderId}");
    //                 return response("APPROVED", 200);
    //             }
    //         } else {
    //             Log::error("Hash validation failed");
    //             return response("FAILURE", 400);
    //         }
    //     } catch (\Exception $e) {
    //         Log::error("Payment Callback Error: " . $e->getMessage());
    //         return response("FAILURE", 500);
    //     }
    // }





}
