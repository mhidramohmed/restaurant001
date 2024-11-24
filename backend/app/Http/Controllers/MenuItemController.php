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

            MenuItem :: create($data);

            return response()->json([
                'messsage'=>"the menu item has been create seccusfully  "
            ], 201);



        } catch (Exception $e) {

            return response()->json(['error' => 'Failed to create MenuItem'], 500);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {

            $menuItem = MenuItem::findOrFail($id);

            if(!$menuItem){
                return response()->json([
                    'message' => "Your MenuItem  doesn't exist"
                ], 404);
            }


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
        } catch (Exception $e) {

            return response()->json(['error' => 'Failed to fetch menu item'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        try {
            $menuItem = MenuItem::find($id);

            // return($menuItem);

            if(!$menuItem){

                return response()->json([
                    'status' => false,
                    'message'=>"Your MenuItem doen't exist "
                ], 404);

            }else{

                $data = $request->validate([
                    'name' => 'sometimes |string',
                    'description' => 'sometimes |string',
                    'price' => 'sometimes |numeric',
                    'image'=> 'sometimes | image | mimes: jpeg,png,jpg,gif,svg|max:2048',
                    'category_id' => 'sometimes |exists:categories,id',
                ]);

                if($request->has('image')){


                    unlink(public_path().'/'.$menuItem->image);


                    $destinationPath = 'MenuItemsImages/';

                    $profileImage = date('YmdHis') . "." . $request->image->getClientOriginalName();

                    $request->image->move($destinationPath, $profileImage);

                    $data['image'] = $profileImage;

                }

                $menuItem->update($data);

                return response()->json(['messsage'=>"the mune_ithem  has been updated successfully  "], 201);

            }
        } catch (\Throwable $th) {
            return response()->json(['error' => 'Failed to update manu_ithem'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $menuItem = MenuItem::find($id);

        if(!$menuItem || $id == '') {
            return response()->json([
                'status' => false,
                'message' => "Menu item doesn't exist"
            ], 200);
        }

        try {
            if($menuItem->image) {
                $imagePath = public_path() . '/' . $menuItem->image;
                if(file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $menuItem->delete();

            return response()->json([
                'status' => true,
                'message' => "Menu item has been deleted successfully"
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => "Failed to delete menu item"
            ], 200);  // Keep 200 to match your category controller pattern
        }
    }
}
