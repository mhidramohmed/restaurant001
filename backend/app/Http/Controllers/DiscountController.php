<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Added missing import

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $discounts = Discount::all();
            return response()->json($discounts);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'menu_item_id' => 'required|exists:menu_items,id',
                'image' => 'nullable|file|image',
                'discount_percentage' => 'required|numeric',
                'expires_at' => 'nullable|date',
                'is_active' => 'nullable|boolean',
            ]);

            $data = $validated;

            if ($request->hasFile('image')) {
                // Define the folder path relative to the public storage
                $path = 'public/images/DiscountImages/';

                Storage::makeDirectory($path);

                // Generate a unique file name
                $profileImage = date('YmdHis') . "_" . $request->file('image')->getClientOriginalName();

                Storage::putFileAs(strtolower($path), $request->file('image'), $profileImage);

                // Generate a public URL for the stored file
                $data['image'] = '/DiscountImages/'. $profileImage;
            }

            $discount = Discount::create($data);
            return response()->json($discount);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $discount = Discount::find($id);

            if(!$discount){
                return response()->json([
                    'message' => "Your Discount doesn't exist"
                ], 404); // Changed to 404 for better HTTP semantics

            } else {
                return response()->json([
                    'data'=> $discount,
                    'message'=>"Data retrieved successfully"
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch discount', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $discount = Discount::find($id);

            if(!$discount){
                return response()->json([
                    'message'=>"Your Discount with ID $id doesn't exist"
                ], 404); // Changed to 404 for better HTTP semantics
            }

            $validated = $request->validate([
                'menu_item_id' => 'required|exists:menu_items,id',
                'image' => 'nullable|file|image',
                'discount_percentage' => 'required|numeric',
                'expires_at' => 'nullable|date',
                'is_active' => 'nullable|boolean',
            ]);

            $data = $validated;

            if($request->hasFile('image')){
                // Remove old image if it exists
                if($discount->image && file_exists(public_path($discount->image))){
                    unlink(public_path($discount->image));
                }

                $destinationPath = 'DiscountImages/';
                $profileImage = date('YmdHis') . "." . $request->file('image')->getClientOriginalName();
                $request->file('image')->move(public_path($destinationPath), $profileImage);
                $data['image'] = '/'.$destinationPath.$profileImage;
            }

            $discount->update($data);

            return response()->json([
                'status' => true,
                'message'=> 'Your Discount has been updated successfully',
                'data' => $discount
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $discount = Discount::find($id);

            if(!$discount || $id == ''){
                return response()->json([
                    'status'=>false,
                    "message"=>"Your Discount with ID $id doesn't exist"
                ], 404); // Changed to 404 for better HTTP semantics
            }

            // Remove image if it exists
            if($discount->image && file_exists(public_path($discount->image))){
                unlink(public_path($discount->image));
            }

            $discount->delete();

            return response()->json([
                'status'=>true,
                "message"=>"Your Discount has been deleted successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}