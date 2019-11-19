<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel & Fabric</title>
        <!-- Fonts -->
{{--        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">--}}
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    </head>
    <body>
        <div class="flex-center position-ref full-height">
            @if (Route::has('login'))
                <div class="top-right links">
                    @auth
                        <a href="{{ url('/home') }}">Home</a>
                    @else
                        <a href="{{ route('login') }}">Login</a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}">Register</a>
                        @endif
                    @endauth
                </div>
            @endif

            <div class="content">

                <div class="container">
                    <div class="row">
                        <div class="title m-b-md">
                            <h3>Laravel & Fabric Js</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-9">
                            <canvas id="canvas" width="800" height="450"></canvas>
                        </div>
                        <div class="col-3">
                            <button id="reset-elements" class="btn btn-danger">Reset</button>
                            <button id="save-elements" class="btn btn-primary">Save Elements</button>
                            <ul id="show-elements" class="list-group"></ul>
                        </div>

                    </div>
                    <div class="row btn-actions">
                        <div class="col-md">
                            <button id="rectangle" data-hint="Rect" class="btn btn-info">+ Rectangle</button>
                        </div>
                        <div class="col-md">
                            <button id="circle" data-hint="Circle" class="btn btn-info">+ Circle</button>
                        </div>
                        <div class="col-md">
                            <button id="triangle" data-hint="Polygon" class="btn btn-info">+ Triangle</button>
                        </div>
                        <div class="col-md">
                            <button id="remove" disabled class="btn btn-danger">Remove Element</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <script src="{{ mix('js/app.js') }}"></script>
    </body>
</html>
