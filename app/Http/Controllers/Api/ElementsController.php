<?php

namespace App\Http\Controllers\Api;

use App\Element;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Element as ElementResource;
use App\Http\Resources\ElementCollection;
use Carbon\Carbon;

class ElementsController extends Controller
{

    /**
     * Display a listing of the resource.
     * @return ElementCollection
     */
    public function index()
    {
        return new ElementCollection(Element::orderBy('updated_at', 'desc')->paginate(4));
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return ElementResource
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'options' => 'required',
        ]);

        if(empty($validatedData['options']['objects'])){
            return response()->json(['status'=> false, 'message' => 'Invalid data for store'], 404);
        }
        $options = json_encode($validatedData['options']);
        if(!is_json($options)){
            return response()->json(['status'=> false, 'message' => 'Invalid json type for elements'], 404);
        }

        $element = new Element();
        $element->title = "Item-". Carbon::now()->toString(); // todo just for show in view
        $element->options = $options;
        $element->save();

        return new ElementResource($element);
    }

    /**
     * Display the specified resource.
     * @param int $id
     * @return ElementResource
     */
    public function show($id)
    {
        return new ElementResource(Element::FindOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return ElementResource
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'options' => 'required',
        ]);

        if(empty($validatedData['options']['objects'])){
            return response()->json(['status'=> false, 'message' => 'Invalid data for update'], 404);
        }

        $options = json_encode($request->options);
        if(!is_json($options)){
            return response()->json(['status'=> false, 'message' => 'Invalid json type for elements'], 404);
        }

        $element = Element::findOrFail($id);
//        $element->title = $request->title;
        $element->options = $options;
        $element->save();

        return new ElementResource($element);
    }

    /**
     * Remove the specified resource from storage.
     * @param $id
     * @return ElementResource
     */
    public function destroy($id)
    {
        $element = Element::findOrFail($id);
        $element->delete();

        return new ElementResource($element);
    }
}
