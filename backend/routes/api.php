<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderElementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



//Routes Categories

// Route::apiResource('categories', CategoryController::class);

Route::get('/categories', [CategoryController::class,'index']);
Route::get('/categories/{id}', [CategoryController::class,'show'])->where('id','\d+');
Route::post('/categories', [CategoryController::class,'store']);
Route::put('/categories/{id}', [CategoryController::class,'update'])->where('id','\d+');
Route::delete('/categories/{id}', [CategoryController::class,'destroy'])->where('id','\d+');




//Routes MenuItems

// Route::apiResource('menu-items', MenuItemController::class);

Route::get('/menu-items', [MenuItemController::class,'index']);
Route::get('/menu-items/{id}', [MenuItemController::class,'show']);
Route::post('/menu-items', [MenuItemController::class,'store']);
Route::put('/menu-items', [MenuItemController::class,'update']);
Route::delete('/menu-items/{id}', [MenuItemController::class,'destroy']);



//Routes Orders

Route::apiResource('orders', OrderController::class);


// Route::get('/orders', [OrderController::class,'index']);
// Route::get('/orders/{id}', [OrderController::class,'show']);
// Route::post('/orders', [OrderController::class,'store']);
// Route::put('/orders', [OrderController::class,'update']);
// Route::patch('/orders/{id}', [OrderController::class, 'update']); //u forgot to add this one
// Route::delete('/orders/{id}', [OrderController::class,'destroy']);

//Routes OrderElements

// Route::apiResource('order-elements', OrderElementController::class);

// Route::prefix('/order-elements')->group(function () {
//     Route::get('quantity-sold', [OrderElementController::class, 'quantitySoldByMenuItem']);
// });

Route::get('/order-elements', [OrderElementController::class,'index']);
Route::get('/order-elements/{id}', [OrderElementController::class,'show']);
Route::post('/order-elements', [OrderElementController::class,'store']);
Route::put('/order-elements', [OrderElementController::class,'update']);
Route::delete('/order-elements/{id}', [OrderElementController::class,'destroy']);
Route::get('/analytics/menu-items/quantity-sold', [OrderElementController::class,'quantitySoldByMenuItem']);


