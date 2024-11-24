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

            // return ($request);
            $data = $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'price' => 'required|numeric',
                'image'=> 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'category_id' => 'required|exists:categories,id',
            ]);

                        // return ($data);


            if($request->hasFile('image')){

                $destinationPath = 'MenuItemsImages/';

                $imageName = date('YmdHis') . "." . $request->image->getClientOriginalExtension();
                $request->image->move($destinationPath, $imageName);

                // Store just the filename in the database
                $data['image'] ="/".$destinationPath.$imageName;
            }


            // if ( $request->has('image')) {

            //     $destinationPath = 'MenuItemsImages/';

            //     $profileImage = date('YmdHis') . "." . $request->image->getClientOriginalName();

            //     $request->image->move($destinationPath, $profileImage);

            //     $data['image'] = '/'.$destinationPath.$profileImage;
            // }

            // return ($data);


            MenuItem::create($data);

            // Transform the image path for the response
            // $menuItem->image = url('MenuItemsImages/' . $menuItem->image);

            return response()->json([
                'status' => true,
                'message' => "The menu item has been created successfully",
                'data' => $data
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'error' => 'Failed to create menu item: ' . $e->getMessage()
            ], 500);
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

            // Transform the image path for the response
            $menuItem->image = url('MenuItemsImages/' . $menuItem->image);

            return response()->json([
                "data" => $menuItem,
                'message'=>"u get ur data "
            ], 200);

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch menu item'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $menuItem = MenuItem::find($id);

            if(!$menuItem){
                return response()->json([
                    'status' => false,
                    'message'=>"Your MenuItem doesn't exist "
                ], 404);
            }

            $data = $request->validate([
                'name' => 'sometimes|string',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric',
                'image'=> 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'category_id' => 'sometimes|exists:categories,id',
            ]);

            if($request->hasFile('image')){
                // Delete old image if exists
                if($menuItem->image) {
                    $oldImagePath = public_path('MenuItemsImages/' . $menuItem->image);
                    if(file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                $imageName = date('YmdHis') . "." . $request->image->getClientOriginalExtension();
                $request->image->move(public_path('MenuItemsImages'), $imageName);
                
                // Store just the filename in the database
                $data['image'] = $imageName;
            }

            $menuItem->update($data);
            $menuItem->refresh();

            // Transform the image path for the response
            $menuItem->image = url('MenuItemsImages/' . $menuItem->image);

            return response()->json([
                'status' => true,
                'message' => "The menu item has been updated successfully",
                'data' => $menuItem
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'error' => 'Failed to update menu item: ' . $th->getMessage()
            ], 500);
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
            ], 404);
        }

        try {
            if($menuItem->image) {
                $imagePath = public_path('MenuItemsImages/' . $menuItem->image);
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
            ], 500);
        }
    }
}