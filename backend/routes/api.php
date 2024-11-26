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
Route::get('/categories/trash', [CategoryController::class,'getDeletedCategories']);


Route::post('/categories', [CategoryController::class,'store']);
Route::post('/categories/{id}', [CategoryController::class,'restoreCategory']);


Route::patch('/categories/{id}', [CategoryController::class,'update'])->where('id','\d+');
Route::delete('/categories/{id}', [CategoryController::class,'destroy'])->where('id','\d+');




//Routes MenuItems

// Route::apiResource('menu-items', MenuItemController::class);

Route::get('/menu-items', [MenuItemController::class,'index']);
Route::get('/menu-items/{id}', [MenuItemController::class,'show'])->where('id','\d+');
Route::get('/menu-items/trash', [MenuItemController::class,'getDeletedMenuItems']);

Route::post('/menu-items', [MenuItemController::class,'store']);
Route::post('/menu-items/{id}', [MenuItemController::class,'restoreMenuItem']);

Route::patch('/menu-items/{id}', [MenuItemController::class,'update'])->where('id','\d+');
Route::delete('/menu-items/{id}', [MenuItemController::class,'destroy'])->where('id','\d+');



//Routes Orders

// Route::apiResource('orders', OrderController::class);


Route::get('/orders', [OrderController::class,'index']);
Route::get('/orders/{id}', [OrderController::class,'show'])->where('id','\d+');
Route::post('/orders', [OrderController::class,'store']);
Route::patch('/orders/{id}', [OrderController::class,'update'])->where('id','\d+');
Route::delete('/orders/{id}', [OrderController::class,'destroy'])->where('id','\d+');
Route::get('/analytics/orders/total', [OrderController::class, 'totalOrders']);
Route::get('/analytics/orders/total-by-payment-method', [OrderController::class, 'totalByPaymentMethod']);
Route::get('/customers/total-spent', [OrderController::class, 'totalSpentByCustomers']);




//Routes OrderElements

// Route::apiResource('order-elements', OrderElementController::class);

// Route::prefix('/order-elements')->group(function () {
//     Route::get('quantity-sold', [OrderElementController::class, 'quantitySoldByMenuItem']);
// });

Route::get('/order-elements', [OrderElementController::class,'index']);
Route::get('/order-elements/{id}', [OrderElementController::class,'show'])->where('id','\d+');
Route::post('/order-elements', [OrderElementController::class,'store']);
Route::patch('/order-elements/{id}', [OrderElementController::class,'update'])->where('id','\d+');
Route::delete('/order-elements/{id}', [OrderElementController::class,'destroy'])->where('id','\d+');
Route::get('/analytics/menu-items/quantity-sold', [OrderElementController::class,'quantitySoldByMenuItem']);



