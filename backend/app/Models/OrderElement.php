<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderElement extends Model
{
    use HasFactory;

    use SoftDeletes;


    protected $fillable = ['order_id', 'menu_item_id', 'name', 'quantity', 'price'];

    // An OrderElement belongs to an Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // An OrderElement belongs to a MenuItem
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }

       public static function getQuantitySoldByMenuItem()
    {


        return self::select('menu_item_id', DB::raw('SUM(quantity) as total_quantity_sold'))
            ->groupBy('menu_item_id')
            ->orderBy('total_quantity_sold', 'desc')
            ->get();
    }



}
