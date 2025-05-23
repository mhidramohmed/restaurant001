<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CategorieResource;

class CategoryController extends Controller
{
    public function index()
    {
        try {

            $categories = Category::with('menuItems')

                ->orderBy('order')
                ->get();


            // return $categories;


            return response()->json([
                'data' => CategorieResource::collection($categories),
                'messsage' => "u get the data  "
            ], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'image' => 'required | image | mimes: jpeg,png,jpg,gif,svg|max:2048'
            ]);

            if ($request->has('image')) {
                // Define the folder path relative to the public storage

                $path = 'public/images/CategoriesImages/';

                Storage::makeDirectory($path);


                // Generate a unique file name
                $profileImage = date('YmdHis') . "_" . $request->image->getClientOriginalName();

                Storage::putFileAs(strtolower($path), $request->image, $profileImage);

                // Generate a public URL for the stored file
                $data['image'] = '/CategoriesImages/' . $profileImage;
            }

            $category = Category::create($data);

            return response()->json([
                'data' => new CategorieResource($category),

                'messsage' => "Category has been create successfully  "

            ], 201);

        } catch (Exception $e) {

            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }

    public function show($id)
    {
        try {

            // return($id);

            $category = Category::find($id);

            // return($category);


            if (!$category) {
                return response()->json([
                    'message' => "Your category  doesn't exist"
                ], 200);


            } else {

                // dd( $category );

                return response()->json([
                    'data' => new CategorieResource($category),
                    // 'data1'=> CategorieResource($category) ,

                    'messsage' => "u get the data  "
                ], 200);

            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch category'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => "Your category whith ID $id doesn't exist"
            ], 200);
        } else {

            $data = $request->validate([
                'name' => 'sometimes |string',
                'image' => 'sometimes | image | mimes: jpeg,png,jpg,gif,svg|max:2048',
            ]);




            if ($request->has('image')) {
                // Define the folder path relative to the public storage

                $path = 'public/images/CategoriesImages/';

                Storage::makeDirectory($path);


                // Generate a unique file name
                $profileImage = date('YmdHis') . "_" . $request->image->getClientOriginalName();

                Storage::putFileAs(strtolower($path), $request->image, $profileImage);




                // Generate a public URL for the stored file
                $data['image'] = '/CategoriesImages/' . $profileImage;
            }


            $category->update($data);

            return response()->json([
                'message' => 'Your Category has updated successfully'
            ], 200);
        }
    }

    public function destroy($id)
    {

        $category = Category::find($id);

        if (!$category || $id == '') {
            return response()->json([
                'status' => false,
                "message" => "Your category whith ID $id doesn't exist "
            ], 200);
        } else {

            // unlink(public_path().'/'.$category->image);

            $category->delete();

            return response()->json([
                'status' => true,
                "message" => "Your category  has deleted successully "
            ], 200);

        }


    }

    public function getDeletedCategories()
    {

        // return('hey');


        $categories = Category::onlyTrashed()->get();


        return response()->json([
            'data' => CategorieResource::collection($categories)
        ], 200);
    }

    public function restoreCategory($id)
    {
        // Restore a specific soft-deleted post
        $category = Category::onlyTrashed()->findOrFail($id);
        $category->restore();

        return response()->json(['message' => ' Your Category has been restore successfully'], 200);

    }

    public function permanentlyDeleteCategory($id)
    {
        // Permanently delete a soft-deleted category
        $category = Category::onlyTrashed()->findOrFail($id);

        // Delete the image file if it exists
        if ($category->image) {
            $imagePath = public_path() . '/' . $category->image;
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Force delete the category
        $category->forceDelete();

        return response()->json(['message' => 'Category permanently deleted'], 200);
    }

    public function reorder(Request $request)
{
    try {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order' => 'required|integer'
        ]);

        foreach ($request->categories as $categoryData) {
            Category::where('id', $categoryData['id'])
                ->update(['order' => $categoryData['order']]);
        }

        return response()->json(['message' => 'Categories reordered successfully'], 200);
    } catch (Exception $e) {
        return response()->json(['error' => 'Failed to reorder categories'], 500);
    }
}
}
