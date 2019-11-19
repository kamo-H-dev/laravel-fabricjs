<?php

if (!function_exists('is_json')) {
    /**
     * Returns a human readable file size
     * @param string $jsonStr
     * @return bool
     *
     * */
    function is_json($jsonStr)
    {
        json_decode($jsonStr);
        return json_last_error() == JSON_ERROR_NONE;
    }
}
