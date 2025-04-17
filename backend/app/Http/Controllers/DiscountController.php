<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\DiscountResource;
use Illuminate\Support\Str;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $discounts = Discount::with('menuItems')->get();

            return DiscountResource::collection($discounts);

            // return response()->json($discounts);
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
                'image' => 'nullable|file|image',
                'discount_percentage' => 'required|numeric',
                'expires_at' => 'nullable|date',
                'is_active' => 'nullable|boolean',
                'menuItems' => 'required|array', // Array of menu item IDs
                'menuItems.*' => 'exists:menu_items,id', // Validate each ID exists
            ]);

            $data = $validated;

            if ($request->hasFile('image')) {
                // Define the folder path relative to the public storage
                // $path = 'public/images/DiscountImages/';

                // Storage::makeDirectory($path);

                // // Get original name and sanitize it
                // $originalName = pathinfo($request->image->getClientOriginalName(), PATHINFO_FILENAME);
                // $extension = $request->image->getClientOriginalExtension();

                // // Generate a clean file name
                // $sanitizedFileName = Str::slug($originalName) . '.' . $extension;
                // $profileImage = date('YmdHis') . "_" . $sanitizedFileName;

                // Storage::putFileAs(strtolower($path), $request->file('image'), $profileImage);

                $filename = date('YmdHis') . '_' . Str::slug(pathinfo($request->image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $request->image->getClientOriginalExtension();

                // Store the new image
                $request->file('image')->storeAs('public/images/DiscountImages', $filename);

                // Save the path in database
                $data['image'] = '/DiscountImages/' . $filename;

            }

            $discount = Discount::create($data);

            // Associate the discount with menu items if provided
            if ($request->has('menuItems')) {
                MenuItem::whereIn('id', $validated['menuItems'])->update(['discount_id' => $discount->id]);
            }

            return response()->json([
                        'status' => true,
                        'message' => 'Discount created successfully!',
                        'data' => new DiscountResource($discount)
                    ], 201);
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
            $discount = Discount::with('menuItems')->find($id);

            if(!$discount){
                return response()->json([
                    'message' => "Your Discount doesn't exist"
                ], 404); // Changed to 404 for better HTTP semantics

            }

            return new DiscountResource($discount);

            }
        catch (\Exception $e) {
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
                // 'menu_item_id' => 'required|exists:menu_items,id',
                'image' => 'nullable|file|image',
                'discount_percentage' => 'required|numeric',
                'expires_at' => 'nullable|date',
                'is_active' => 'nullable|boolean',
                'menuItems' => 'nullable|array', // Array of menu item IDs
                'menuItems.*' => 'exists:menu_items,id', // Validate each ID exists
            ]);

            $data = $validated;

            if($request->hasFile('image')){
                // Define the folder path
                // $path = 'public/images/DiscountImages/';

                // // Delete old image if it exists (adjust path to match your storage structure)
                // if($discount->image) {
                //     Storage::delete('public/images' . $discount->image);
                // }

                if ($discount->image) {
                    $oldPath = 'public/images' . $discount->image; // e.g. /DiscountImages/file.jpg → public/images/DiscountImages/file.jpg
                    Storage::delete($oldPath);
                }

                // // Get original name and sanitize it
                // $originalName = pathinfo($request->image->getClientOriginalName(), PATHINFO_FILENAME);
                // $extension = $request->image->getClientOriginalExtension();

                // // Generate a clean file name
                // $sanitizedFileName = Str::slug($originalName) . '.' . $extension;
                // $profileImage = date('YmdHis') . "_" . $sanitizedFileName;

                // // Store the new image
                // Storage::putFileAs(strtolower($path), $request->file('image'), $profileImage);

                // Set the database value to be consistent with the store method
                // $data['image'] = '/DiscountImages/'. $profileImage;


                $filename = date('YmdHis') . '_' . Str::slug(pathinfo($request->image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $request->image->getClientOriginalExtension();

                // Store the new image
                $request->file('image')->storeAs('public/images/DiscountImages', $filename);

                // Save the path in database
                $data['image'] = '/DiscountImages/' . $filename;
            }

            $discount->update($data);

            if ($request->has('menuItems')) {
                // First, disassociate all menu items from this discount
                $discount->menuItems()->update(['discount_id' => null]); // Remove the discount association from all menu items

                // Now, associate the new menu items
                foreach ($request->menuItems as $menuItemId) {
                    $menuItem = MenuItem::find($menuItemId);
                    if ($menuItem) {
                        $menuItem->discount_id = $discount->id; // Assign the discount_id to the menu item
                        $menuItem->save(); // Save the changes
                    }
                }
            }

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
