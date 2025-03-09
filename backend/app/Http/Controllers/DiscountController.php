<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;

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

            $request->validate([
                'menu_item_id' => 'required|exists:menu_items,id',
                'image' => 'nullable',
                'discount_percentage' => 'required|numeric',
                'expires_at' => 'nullable|date',
                'is_active' => 'nullable|boolean',
            ]);

            if ($request->has('image')) {
                // Define the folder path relative to the public storage

                $path = 'public/images/DiscountImages/';

                Storage::makeDirectory($path);


                // Generate a unique file name
                $profileImage = date('YmdHis') . "_" . $request->image->getClientOriginalName();

                Storage::putFileAs(strtolower($path), $request->image, $profileImage);

                // Generate a public URL for the stored file
                $data['image'] = '/DiscountImages/'. $profileImage;
            }


            $discount = Discount::create($request->all());
            return response()->json($discount);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {
        try {

            // return($id);

            $discount = Discount:: find($id);

                      // return($discount);


            if(!$discount){
                return response()->json([
                    'message' => "Your Discount  doesn't exist"
                ], 200);


            }else{

                // dd( $discount );

                return response()->json([
                    'data'=> ($discount) ,
                    'messsage'=>"u get the data  "
                ],200);

            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch discount'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Discount $discount)
    {
        $discount = Discount::find($id);

        if(!$discount){
            return response()->json([
                'message'=>"Your Discount whith ID $id doesn't exist"
            ], 200);
        }else{

            $data = $request->validate([
                'menu_item_id' => 'required|exists:menu_items,id',
                'image' => 'nullable',
                'discount_percentage' => 'required|numeric',
                'expires_at' => 'nullable|date',
                'is_active' => 'nullable|boolean',
            ]);


            if($request->hasFile('image')){

                if(!$discount->image){

                }

                unlink(public_path().'/'.$discount->image);

                $destinationPath = 'DiscountImages/';

                $profileImage = date('YmdHis') . "." . $request->image->getClientOriginalName();

                $request->image->move($destinationPath, $profileImage);

                $data['image'] = '/'.$destinationPath.$profileImage;
            }


            $discount->update($data);

            return response()->json([
                'message'=> 'Your Discount has updated successfully'
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {

      $discount  = Discount::find($id);

      if(!$discount || $id ==''){
            return response()->json([
            'status'=>false,
            "message"=>"Your Discount whith ID $id doesn't exist "
        ], 200);
      }else{

        // unlink(public_path().'/'.$discount->image);

        $discount->delete();

        return response()->json([
            'status'=>true,
            "message"=>"Your Discount  has deleted successully "
        ], 200);

      }


    }
}
