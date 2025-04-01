<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory, SoftDeletes;

    // Allow mass assignment for these attributes
    protected $fillable = ['name', 'description', 'price', 'image', 'category_id'];

    // Add custom attributes to the model's JSON form
    protected $appends = ['image_url','sells'];

    protected $hidden = ['orderElements'];

    /**
     * A MenuItem belongs to a Category
     */
   public function getSellsAttribute()
{
    // Calculate the total quantity sold across all related OrderElements
    return $this->orderElements->sum('quantity') > 0
        ? $this->orderElements->sum('quantity')
        : 'no sells';
}
    public function category()
    {
        return $this->belongsTo(Category::class);
    }



    /**
     * A MenuItem has many Discounts
     */
    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }
    /**
     * A MenuItem has many OrderElements
     */
    public function orderElements()
    {
        return $this->hasMany(OrderElement::class);
    }

    /**
     * Accessor for the 'image_url' attribute
     *
     * Generate a full URL for the image.
     */
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return url($this->image); // Assumes images are stored in the "storage/app/public" directory
        }
        return null; // Return null if no image is set
    }
}
