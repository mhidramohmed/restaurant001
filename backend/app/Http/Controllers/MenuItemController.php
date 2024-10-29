<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $menuItem = MenuItem::all();

            return response()->json([
                'data' => $menuItem,
                'message' => 'u get the data'
            ], 200);

        } catch (\Throwable $th) {

            return response()->json([ 'error' =>'Failed to fetch menu item' ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $data = $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'price' => 'required|numeric',
                'image'=> 'required | image | mimes: jpeg,png,jpg,gif,svg|max:2048',
                'category_id' => 'required|exists:categories,id',
            ]);

            if($request->has('image')){

                $distinationPath = 'MenuItemsImages/';

                $imageName = date('YmdHis') . "." . $request->image->getClientOriginalName();

                $request->image->move($distinationPath,$imageName);

                $data['image'] = $imageName;

            }

            // dd($data)
            MenuItem :: create($data);

            return response()->json([
                'messsage'=>"the category is been create seccusfully  "
            ], 201);



        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to create MenuItem'], 500);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MenuItem $menuItem)
    {
        try {
            if($menuItem){

                return response()->json([
                    "data" => $menuItem,
                    'messsage'=>"u get ur data "
                ], 201);
            }else{

                return response()->json([
                    'messsage'=>"Your MenuItem doesn't exist  "
                ], 404);
            }
        } catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to fetch menu item'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        try {
            if($menuItem){

                $data = $request->validate([
                    'name' => 'sometimes |string',
                    'description' => 'sometimes |string',
                    'price' => 'sometimes |numeric',
                    'image'=> 'sometimes | image | mimes: jpeg,png,jpg,gif,svg|max:2048',
                    'category_id' => 'sometimes |exists:categories,id',
                ]);

                if($request->has('image')){

                    $olddestination ='MenuItemsImages/'. $menuItem['image'];

                    if(\File::exists($olddestination)){

                        \File::delete($olddestination);

                    }

                    $distinationPath = 'MenuItemImage/';

                    $imageName = date('YmdHis') . "_" . $request->image->getClientOriginalName();

                    $request->image->move($distinationPath,$imageName);

                    $data['image'] = $imageName;

                }

                $menuItem->update($data);

                return response()->json(['messsage'=>"the mune_ithem  has been updated successfully  "], 201);

            }else{

                return response()->json(['message' => "Your MenuItem doesn't exist"], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to update manu_ithem'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuItem $menuItem)
    {
        try {
            if($menuItem){

                $olddestination = $menuItem['image'];

                if(\File::exists($olddestination)){

                    \File::delete($olddestination);

                }

                $menuItem->delete();

            }else{
                return response()->json(['message' => "Your MenuItem doesn't exist"], 404);
            }
        }catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to update manu_ithem'], 500);
        }
    }
}
