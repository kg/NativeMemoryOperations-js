/*
    Native memory operations JS polyfill v0
    by Kevin Gadd (@antumbral, kevin.gadd@gmail.com)

    https://github.com/kevingadd/NativeMemoryOperations-js
    Released under the MIT open source license.

    To use, call NativeMemoryOperations.installPolyfills() to make the polyfills available.
    You may then use NativeMemoryOperations.memcpy and NativeMemoryOperations.memset for convenience.
*/

if (typeof (NativeMemoryOperations) === "undefined") {
    NativeMemoryOperations = Object.create(null);

    /*
        Attempts to match C memcpy semantics, but operates element-wise.
        Polyfills must be installed.
    */
    NativeMemoryOperations.memcpy = function memcpy (
        destTypedArray, destOffsetInElements, 
        sourceTypedArray, sourceOffsetInElements, countInElements
    ) {
        destTypedArray.moveRange(
            destOffsetInElements | 0,
            sourceTypedArray, sourceOffsetInElements | 0, (sourceOffsetInElements + countInElements) | 0
        );
    };

    /*
        Attempts to match C memset semantics, but operates element-wise.
        Polyfills must be installed.
    */
    NativeMemoryOperations.memset = function memset (
        destTypedArray, destOffsetInElements, 
        countInElements, value
    ) {
        destTypedArray.setRange(
            destOffsetInElements | 0,
            countInElements | 0, value
        );
    };
    
    /* 
        TypedArray.prototype.moveRange polyfill. 
        |this| must be a Typed Array of the same type as |sourceTypedArray|.
        Copies elements [sourceStartOffsetInElements, sourceEndOffsetInElements) to |this| starting at destOffsetInElements.
        sourceEndOffsetInElements must >= sourceStartOffsetInElements.
    */
    NativeMemoryOperations.moveRange = function moveRange (
        destOffsetInElements, 
        sourceTypedArray, sourceStartOffsetInElements, sourceEndOffsetInElements
    ) {
        if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(sourceTypedArray))
            throw new Error("Source and destination typed arrays must be of the same type.");
        if (sourceEndOffsetInElements < sourceStartOffsetInElements)
            throw new Error("End offset must be greater than or equal to start offset.");
    }
    
    /* 
        TypedArray.prototype.setRange polyfill. |this| must be a Typed Array.
        Copies |value| to elements [startOffsetInElements, endOffsetInElements) of |this|.
    */
    NativeMemoryOperations.setRange = function setRange (
        startOffsetInElements, endOffsetInElements,
        value
    ) {
         throw new Error("Not implemented");
    }
    
    /*
        Installs TypedArray.prototype.moveRange and TypedArray.prototype.setRange
        polyfills if not implemented natively.
    */
    NativeMemoryOperations.installPolyfills = function () {
        var testTypedArray = new Uint8Array();
        
        var installMoveRange = typeof (testTypedArray.moveRange) !== "function";
        var installSetRange = typeof (testTypedArray.setRange) !== "function";
        
        // FIXME: Add Uint64Array and Int64Array once those types are introduced.
        var typedArrayTypes = [
            Uint8Array, Uint16Array, Uint32Array,
            Int8Array, Int16Array, Int32Array,
            Float32Array, Float64Array
        ];
        
        for (var i = 0, l = typedArrayTypes.length; i < l; i++) {
            var typedArrayType = typedArrayTypes[i];
            if (!typedArrayType)
                continue;
            
            var typedArrayProto = typedArrayType.prototype;
            if (installMoveRange && (typeof (typedArrayProto.moveRange) !== "function"))
                typedArrayProto.moveRange = NativeMemoryOperations.moveRange;
            if (installSetRange && (typeof (typedArrayProto.setRange) !== "function"))
                typedArrayProto.setRange = NativeMemoryOperations.setRange;
        }
    };

};