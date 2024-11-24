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

            $categories = Category::with("menuItems")->get();
            // return $categories;


            return response()->json([
                'data'=> ($categories) ,
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

                $data['image'] = '/'.$destinationPath.$profileImage;
            }

            Category::create($data);

            return response()->json([

                'messsage'=>"Category has been create successfully  "

            ], 201);

        } catch (Exception $e) {

            return response()->json(['error' => 'Failed to create category'], 500);
        }
    }

    public function show( $id)
    {
        try {
            $category = Category:: findOrFail($id);

            if(!$category){
                return response()->json([
                    'message' => "Your category  doesn't exist"
                ], 404);


            }else{

                    return response()->json([
                    'data'=>
                    [
                        'category'->$category,
                    ],

                    'messsage'=>"u get the data  "
                    ],200);

            }

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch category'], 500);
        }
    }

    public function update(Request $request,$id)
    {
        $category = Category::find($id);

        if(!$category){
            return response()->json([
                'message'=>"Your category whith ID $id doesn't exist"
            ], 404);
        }else{

            $data = $request->validate([
                'name' => 'sometimes |string',
                'description' => 'sometimes |string',
                'image'=> 'sometimes | image | mimes: jpeg,png,jpg,gif,svg|max:2048',
            ]);


            if($request->hasFile('image')){

                unlink(public_path().'/'.$category->image);

                $destinationPath = 'CategoriesImages/';

                $profileImage = date('YmdHis') . "." . $request->image->getClientOriginalName();

                $request->image->move($destinationPath, $profileImage);

                $data['image'] = '/'.$destinationPath.$profileImage;
            }


            $category->update($data);

            return response()->json([
                'message'=> 'Your Category has updated successfully'
            ], 200);
        }
    }

    public function destroy($id)
    {

      $category  = Category::find($id);

      if(!$category || $id ==''){
            return response()->json([
            'status'=>false,
            "message"=>"Your category whith ID $id doesn't exist "
        ], 200);
      }else{

        unlink(public_path().'/'.$category->image);


        $category->delete();

        return response()->json([
            'status'=>true,
            "message"=>"Your category  has deleted successully "
        ], 200);

      }


    }
}
