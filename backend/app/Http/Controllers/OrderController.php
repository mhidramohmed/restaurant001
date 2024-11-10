<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  // <-- Import DB facade here


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $orders = Order::all();

            return response()->json(['data'=>$orders], 200);

        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to fetch orders'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Begin a database transaction to ensure everything is processed atomically
        DB::beginTransaction();

        try {
            // Validate the incoming request
            $validated = $request->validate([
                'client_name' => 'required|string|max:255',
                'client_email' => 'required|email|max:255',
                'client_phone' => 'required|string|max:20',
                'client_address' => 'required|string|max:255',
                'total_price' => 'required|numeric',
                'payment_method' => 'required|string|in:visa,cash',
                // 'status' => 'required|string|in:pending,delivered,declined', //shouldent be passed in the request, it have a default value
                'order_items' => 'required|array',
                'order_items.*.menu_item_id' => 'required|exists:menu_items,id',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.price' => 'required|numeric',
                // Conditional validation for Visa payment method
                'card_details.card_number' => 'required_if:payment_method,visa|string|digits_between:13,19',
                'card_details.card_expiry' => 'required_if:payment_method,visa|date_format:m/y',
                'card_details.card_cvv' => 'required_if:payment_method,visa|string|digits:3',
            ]);

            // Create the order
            $order = Order::create([
                'client_name' => $validated['client_name'],
                'client_email' => $validated['client_email'],
                'client_phone' => $validated['client_phone'],
                'client_address' => $validated['client_address'],
                'total_price' => $validated['total_price'],
                'payment_method' => $validated['payment_method'],
                // 'status' => $validated['status'], //default value
            ]);


            // If payment method is Visa, process payment details (optional step)
            if ($validated['payment_method'] === 'visa') {
                // Here you would typically integrate with a payment gateway.
                // For demonstration, we'll just log the card details.
                // NEVER store raw card details in your database.
                // This is just a placeholder to show how you might handle it.
                $cardDetails = $validated['card_details'];
                // Log or process the card details as needed
                // Integrate with your payment gateway here using $cardDetails
                // Example:
                // $paymentResult = PaymentGateway::charge($cardDetails, $order->total_price);
                // if (!$paymentResult->success) {
                //     throw new \Exception('Payment failed: ' . $paymentResult->message);
                // }
            }


            // Loop through the order items and create each OrderElement
            foreach ($validated['order_items'] as $orderItem) {
                $order->orderElements()->create([
                    'menu_item_id' => $orderItem['menu_item_id'],
                    'quantity' => $orderItem['quantity'],
                    'price' => $orderItem['price'],
                ]);
            }

            // Commit the transaction
            DB::commit();

            // Return a success response
            return response()->json(['message' => 'Order and OrderElements created successfully'], 201);

        } catch (\Throwable $th) {
            // Rollback the transaction in case of error
            DB::rollBack();

            // Return an error response
            return response()->json([
                'error' => 'Failed to create the order',
                'details' => $th->getMessage()  // Optional for debugging
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        try {
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
    public function update(Request $request, Order $order)
    {
        try {
            if($order){

                $data = $request->validate([
                    'client_name' => 'sometimes|string|max:255',
                    'client_email' => 'sometimes|email|max:255',
                    'client_phone' => 'sometimes|string|max:20',
                    'client_address' => 'sometimes|string|max:255',
                    'total_price' => 'sometimes|numeric',
                    'payment_method' => 'sometimes|string|in:paypal,cash',
                    'status' => 'sometimes|string|in:pending,delivered,declined',
                ]);

                $order->update($data);

                return response()->json(['messsage'=>"the Order  has been updated successfully  "], 201);

            }else{

                return response()->json(['message' => "Your Order doesn't exist"], 404);
            }

        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to update Order'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        try {
            if($order){

                $order->delete();

                return response()->json(['messsage'=>"the Order  has been deleted successfully  "], 201);

            }else{

                return response()->json(['message' => "Your Order doesn't exist"], 404);
            }
            
        } catch (\Throwable $th) {
            
            return response()->json(['error' => 'Failed to delete  Order'], 500);
        }
    }
}
