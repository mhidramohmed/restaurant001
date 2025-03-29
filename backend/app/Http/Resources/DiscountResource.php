<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "discount_percentage" => $this->discount_percentage,
            "expires_at" => $this->expires_at,
            "is_active" => $this->is_active,
            "image" => $this->image ? url("/storage/images/" . $this->image) : null, // Discount image
            "menuItems" => $this->menuItems->map(function ($menuItems) {
                return [
                    "id" => $menuItems->id,
                    "name" => $menuItems->name,
                    "price" => $menuItems->price,
                    "image" => url("/storage/images/" . $menuItems->image),
                ];
            })->all(),
        ];
    }
}
