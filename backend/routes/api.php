         <?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\MenuItemController;
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

Route::get('/categories', [CategoryController::class,'index']);
Route::get('/categories/{id}', [CategoryController::class,'show'])->where('id','\d+');
Route::get('/categories/trashed', [CategoryController::class,'getDeletedCategories']);


Route::post('/categories', [CategoryController::class,'store']);
Route::post('/categories/{id}/restore', [CategoryController::class,'restoreCategory']);
Route::delete('/categories/{id}/force', [CategoryController::class, 'permanentlyDeleteCategory']);


Route::patch('/categories/{id}', [CategoryController::class,'update'])->where('id','\d+');
Route::delete('/categories/{id}', [CategoryController::class,'destroy'])->where('id','\d+');




//Routes MenuItems

Route::get('/menu-items', [MenuItemController::class,'index']);
Route::get('/menu-items/trashed', [MenuItemController::class, 'getDeletedMenuItems']);

Route::get('/menu-items/{id}', [MenuItemController::class,'show'])->where('id','\d+');

Route::post('/menu-items', [MenuItemController::class,'store']);
Route::post('/menu-items/{id}/restore', [MenuItemController::class, 'restoreMenuItem']);
Route::delete('/menu-items/{id}/force', [MenuItemController::class, 'permanentlyDeleteMenuItem']);


Route::patch('/menu-items/{id}', [MenuItemController::class,'update'])->where('id','\d+');
Route::delete('/menu-items/{id}', [MenuItemController::class,'destroy'])->where('id','\d+');



//Routes Orders

Route::get('/orders', [OrderController::class,'index']);
Route::get('/orders/{id}', [OrderController::class,'show'])->where('id','\d+');
Route::post('/orders', [OrderController::class,'store']);
Route::patch('/orders/{id}', [OrderController::class,'update'])->where('id','\d+');
Route::delete('/orders/{id}', [OrderController::class,'destroy'])->where('id','\d+');
Route::get('/analytics/orders/total', [OrderController::class, 'totalOrders']);
Route::get('/analytics/orders/total-by-payment-method', [OrderController::class, 'totalByPaymentMethod']);
Route::get('/customers/total-spent', [OrderController::class, 'totalSpentByCustomers']);

Route::post('/payment/success', [OrderController::class, 'paymentSuccess'])->name('payment.success');


Route::post('/payment/fail', [OrderController::class, 'paymentFail'])->name('payment.fail');


Route::post('/payment/callback', [OrderController::class, 'paymentCallback'])->name('payment.callback');

//Routes OrderElements
Route::get('/order-elements', [OrderElementController::class,'index']);
Route::get('/order-elements/{id}', [OrderElementController::class,'show'])->where('id','\d+');
Route::post('/order-elements', [OrderElementController::class,'store']);
Route::patch('/order-elements/{id}', [OrderElementController::class,'update'])->where('id','\d+');
Route::delete('/order-elements/{id}', [OrderElementController::class,'destroy'])->where('id','\d+');
Route::get('/analytics/menu-items/quantity-sold', [OrderElementController::class,'quantitySoldByMenuItem']);


Route::resource('discount', DiscountController::class);


Route::apiResource('reservations', ReservationController::class);


