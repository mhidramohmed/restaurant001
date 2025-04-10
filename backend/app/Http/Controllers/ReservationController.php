<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
       public function index()
    {
        return response()->json([
            'data' => Reservation::all()
        ]);
    }

    // Create a new reservation
    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'phone'  => 'required|string|max:20',
            'date'   => 'required|date',
            'time'   => 'required|date_format:H:i',
            'guests' => 'required|integer|min:1',
            'notes'  => 'nullable|string',
        ]);

        $reservation = Reservation::create($request->all());

        return response()->json([
            'message' => 'Reservation created successfully!',
            'data'    => $reservation
        ], 201);
    }

    // Show a single reservation
    public function show($id)
    {
        $reservation = Reservation::findOrFail($id);
        return response()->json($reservation);
    }

    // Update reservation
    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $reservation->update($request->all());

        return response()->json([
            'message' => 'Reservation updated successfully!',
            'data'    => $reservation
        ]);
    }

    // Delete reservation
    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();

        return response()->json([
            'message' => 'Reservation deleted successfully.'
        ]);
    }

}
