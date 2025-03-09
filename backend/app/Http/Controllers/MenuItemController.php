<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\MenuItemResource;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // $menuItem = MenuItem::all();
            $menuItem = MenuItem::with('category','discounts')->get();

            return response()->json([
                'data' => MenuItemResource::collection($menuItem),
                'message' => 'u get the data'
            ], 200);

        } catch (Exception $e) {

            return response()->json([ 'error' =>'Failed to fetch menu item' ], 200);
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


            if ($request->has('image')) {
                // Define the folder path relative to the public storage
                $path = 'public/images/MenuItemsImages/';

                Storage::makeDirectory($path);
                // Generate a unique file name
                $profileImage = date('YmdHis') . "_" . $request->image->getClientOriginalName();

                // Store the file in the public disk
                Storage::putFileAs(strtolower($path), $request->image, $profileImage);

                // Generate a public URL for the stored file
                $data['image'] = '/MenuItemsImages/'. $profileImage;
            }

            $menuItem=MenuItem::create($data);

            return response()->json([
                'data'=> new MenuItemResource($menuItem),

                'messsage'=>"MenuItem has been create successfully  "

            ], 201);

        } catch (Exception $e) {

            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // dd('hhh');
        try {
        // dd('hhh');

            $menuItem = MenuItem::findOrFail($id);

            // return ($id);

            // dd ($menuItem);

            if(!$menuItem){
                return response()->json([
                    'message' => "Your MenuItem  doesn't exist"
                ], 200);
            }

            // return ('hhhh');


                return response()->json([
                    'data' =>new  MenuItemResource($menuItem)
                ], 200);

        } catch (\Throwable $th) {

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
                ], 200);

            }else{

            $data = $request->validate([
                'name' => 'sometimes|string',
                'description' => 'sometimes|string|nullable',
                'price' => 'sometimes|numeric',
                'image'=> 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'category_id' => 'sometimes|exists:categories,id',
            ]);

                if($request->has('image')){


                    unlink(public_path().'/'.$menuItem->image);


                    $destinationPath = 'MenuItemsImages/';

                    $profileImage = date('YmdHis') . "." . $request->image->getClientOriginalName();

                    $request->image->move($destinationPath, $profileImage);

                    $data['image'] = '/'.$destinationPath.$profileImage;

                }

                $menuItem->update($data);

                return response()->json(['messsage'=>"the mune_ithem  has been updated successfully  "], 201);

            }
        } catch (\Throwable $th) {
            return response()->json([
                'error' => 'Failed to update menu item: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        try {
            $menuItem = MenuItem::find($id);
            if(!$menuItem){

            return response()->json([
                'status' => false,
                'message'=>"Your MenuItem doen't exist "
            ], 200);

            }else{

            // unlink(public_path().'/'.$menuItem->image);


            $menuItem->delete();

            return response()->json([
                'status' => true,
                'message'=>"Your MenuItem has been deleted successfully "
            ], 200);


            }
        }catch (\Throwable $th) {

            return response()->json(['error' => 'Failed to update manu_ithem'], 500);
        }
    }


    public function getDeletedMenuItems()
{
    \Log::info('Attempting to retrieve deleted menu items');

    try {
        $menuItems = MenuItem::onlyTrashed()->get();

        \Log::info('Trashed menu items count: ' . $menuItems->count());

        return response()->json([
            'data' => $menuItems,
            'count' => $menuItems->count(),
            'message' => 'Deleted menu items retrieved successfully'
        ], 200);
    } catch (\Exception $e) {
        \Log::error('Error in getDeletedMenuItems: ' . $e->getMessage());

        return response()->json([
            'error' => 'Failed to retrieve deleted menu items',
            'message' => $e->getMessage()
        ], 500);
    }
}

public function restoreMenuItem($id)
{
    $MenuItem = MenuItem::onlyTrashed()->find($id);

    if (!$MenuItem) {
        return response()->json(['error' => 'MenuItem not found or already restored'], 404);
    }

    $MenuItem->restore();

    return response()->json(['message' => 'Your MenuItem has been restored successfully'], 200);
}

}
