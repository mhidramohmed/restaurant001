<?php

namespace App\Http\Controllers;

use App\Models\OrderElement;
use Illuminate\Http\Request;

class OrderElementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try {

            $orderElements = OrderElement::all();

            return response()->json([
                'data' => $orderElements,
                'message' => 'u get the data'
            ], 200);

        } catch (\Throwable $th) {

            return response()->json([ 'error' =>'Failed to fetch order-elements' ], 500);
        }

    }




    public function quantitySoldByMenuItem()
    {

        $salesData = OrderElement::getQuantitySoldByMenuItem();
        return response()->json($salesData);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     //
    // }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {
        try {
            $orderElement = OrderElement::find($id);

            if($orderElement){

                return response()->json([
                    "data" => $orderElement,
                    'messsage'=>"hhh "
                ], 201);
            }else{

                return response()->json([
                    'messsage'=>"Your orderElement doesn't exist  "
                ], 404);
            }
        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to fetch orderElement'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrderElement $orderElement)
    {
        try {
            if($orderElement){

                $data = $request->validate([
                    'order_id' => 'sometimes|numeric',
                    'menu_item_id' => 'sometimes|numeric',
                    'quantity' => 'sometimes|numeric|min:1',
                    'price' => 'sometimes|numeric',
                ]);

                $orderElement->update($data);

                return response()->json(['messsage'=>"the orderElement  has been updated successfully  "], 201);

            }else{

                return response()->json(['message' => "Your orderElement doesn't exist"], 404);
            }

        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to update orderElement'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderElement $orderElement)
    {
        try {
            if($orderElement){

                $orderElement->delete();

                return response()->json(['messsage'=>"the orderElement  has been deleted successfully  "], 201);

            }else{

                return response()->json(['message' => "Your orderElement doesn't exist"], 404);
            }

        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to delete  orderElement'], 500);
        }
    }
}
