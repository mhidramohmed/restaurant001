<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    use SoftDeletes;


    protected $fillable = ['client_name','client_email','client_phone','client_address','total_price','payment_method','status','order_status','payment_status','stripe_session_id'];

    // An Order has many OrderElements
    public function orderElements()
    {
        return $this->hasMany(OrderElement::class);
    }

    public static function getTotalOrders()
    {
        return self::count();
    }

    public static function getTotalByPaymentMethod()
    {
        return self::select('payment_method', DB::raw('SUM(total_price) as total_amount'))
            ->whereIn('payment_method', ['cash', 'visa'])
            ->groupBy('payment_method')
            ->get();
    }

    public static function getTotalSpentByCustomers()
    {
        return self::select('client_name', 'client_phone', DB::raw('SUM(total_price) as total_spent'))
            ->groupBy('client_phone', 'client_name')
            ->orderBy('total_spent', 'desc')
            ->get();
    }
}
