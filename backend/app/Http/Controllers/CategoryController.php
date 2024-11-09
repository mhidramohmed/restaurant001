<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
     public function index()
    {
        try {
            $categories = Category::all();
            return response()->json([
                'data'=> $categories,
                'messsage'=>"u get the data  "
            ],200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $data = $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'image'=> 'required | image | mimes: jpeg,png,jpg,gif,svg|max:2048'
            ]);



            if ( $request->has('image')) {

                $destinationPath = 'CategoriesImages/';

                $profileImage = date('YmdHis') . "." . $request->image->getClientOriginalName();

                $request->image->move($destinationPath, $profileImage);

                $data['image'] = $profileImage;
            }


            Category::create($data);

            return response()->json([

                'messsage'=>"Category has been create successfully  "

            ], 201);

        } catch (Exception $e) {

            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }

    public function show(Category $category)
    {
        try {
            if($category){

                $menuItems = MenuItem::where('category_id',$category->id)->get();

                return response()->json([
                'data'=> [$category,$menuItems],
                'messsage'=>"u get the data  "
                ],200);

            }else{

                return response()->json([
                    'message' => "Your category  doesn't exist"
                ], 404);
            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch category'], 500);
        }
    }

    public function update(Request $request, Category $category)
    {
        try {

            // dd($request);

            if($category){

                $data = $request->validate([
                    'name' => 'sometimes|string',
                    'description' => 'sometimes|string',
                    'image'=> ' sometimes|  image | mimes: jpeg,png,jpg,gif,svg|max:2048'
                ]);


                if($request->has('image')){
                    $olddestination = 'CategoriesImages/'.$category->image;

                    if(\File::exists($olddestination)){

                        \File::delete($olddestination);

                    }


                    $destinationPath = 'CategoriesImages/';
                    $profileImage = date('YmdHis') . "_" . $request->image->getClientOriginalName();
                    $request->image->move($destinationPath, $profileImage);
                    $data['image'] = "$profileImage";
                }

                $category->update($data);
                $category->refresh(); // Reloads the updated data


                return response()->json([
                    'message' => "The category was updated successfully.",
                    'request' => $request
                ]);                
            }else{

                return response()->json([
                    'message' => "Your category  doesn't exist"
                ], 404);
            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update category'], 500);
        }
    }

    public function destroy(Category $category)
    {
        try {
            if ($category) {
                $imagePath = public_path('CategoriesImages/' . $category->image);

                // Ensure the file exists before attempting to delete it
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }

                $category->delete();

                return response()->json([
                    'messsage'=>"the category deleted seccusfully"
                ], 204);
            }


        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete category'], 500);
        }
    }
}
