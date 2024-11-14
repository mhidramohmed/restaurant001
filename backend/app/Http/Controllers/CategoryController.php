<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Http\Resources\CategorieResource;

class CategoryController extends Controller
{
     public function index()
    {
        try {
            
            $categories = Category::all();
            return CategorieResource::collection($categories)    ;
            return response()->json([
                'data'=> $categories,
                'messsage'=>"u get the data  "
            ],200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch categories'], 200);
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

    public function update(Request $request,$id)
    {
        // try {

        //     $cate = Category::find($id);



        //     //    return(gettype($cate));

        //     if($cate){

        //         $data = $request->validate([
        //             'name' => 'sometimes|string',
        //             'description' => 'sometimes|string',
        //             'image'=> ' sometimes|  image | mimes: jpeg,png,jpg,gif,svg|max:2048'
        //         ]);
        //         // info('ALIDATION PASSED ');

        //         if($request->has('image')){
        //             // info('HAS IMAGE ');

        //             $olddestination = 'CategoriesImages/'.$cate->image;

        //             if(File::exists($olddestination)){
        //             // info('FILE EXESIT ');


        //                 File::delete($olddestination);
        //                 //  info('FILE Delted ');

        //             }


        //             $destinationPath = 'CategoriesImages/';
        //             $profileImage = date('YmdHis') . "_" . $request->image->getClientOriginalName();
        //             $request->image->move($destinationPath, $profileImage);
        //             $data['image'] = "$profileImage";
        //         }

        //         $cate->update($data);
        //         // $category->refresh(); // Reloads the updated data


        //         return response()->json([
        //             'message' => "The category was updated successfully.",
        //             'request' => $request
        //         ]);
        //     }else{

        //         return response()->json([
        //             'message' => "Your category  doesn't exist"
        //         ], 404);
        //     }

        // } catch (Exception $e) {

        //     return response()->json(['error' => 'Failed to update category'], 500);
        // }

        // $categorie = Category::find($id);
        info('i was here ');
        return($request->all()) ;
        if (!$categorie){ return "not existe" ;  }
        $category = [
                "name" => $request->name ,
                "image" => "chemin",
                "description" => $request->description
        ];
            $categorie->update($category) ;
        return  "success";






    }

    public function destroy($id)
    {

      $category  = Category::find($id);

      if(!$category || $id =='')  return response()->json([
        'status'=>false,
        "message"=>"Your category whith ID $id doesn't exist "
      ], 200);

    //   return public_path().'/'.$category->image;
      unlink(public_path().'/'.$category->image);
      $category->delete();

      return response()->json([
        'status'=>true,
        "message"=>"Your category  has deleted successully "
      ], 200);
    }
}
