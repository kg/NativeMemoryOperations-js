/*
    Native memory operations JS polyfill v0
    by Kevin Gadd (@antumbral, kevin.gadd@gmail.com)

    https://github.com/kevingadd/NativeMemoryOperations-js
    Released under the MIT open source license.

    To use, call NativeMemoryOperations.installPolyfills() to make the polyfills available.
    You may then use NativeMemoryOperations.memcpy and NativeMemoryOperations.memset for convenience.
*/

if (typeof (NativeMemoryOperations) === "undefined") {
    var NativeMemoryOperations = Object.create(null);

    // FIXME: This should probably just fallback to some other lookup mechanism, or create the Uint8Array every time.
    if (typeof (WeakMap) === "undefined")
        throw new Error("WeakMaps are required");

    NativeMemoryOperations.byteArrayCache = new WeakMap();

    /*
        For the given typed array, returns a Uint8Array pointing at its underlying buffer.
        The returned Uint8Array always has an offset of 0 and a length equal to the length of the buffer.
        The array will be cached where possible to reduce GC pressure.
    */
    NativeMemoryOperations.getByteArrayForTypedArray = function getByteArrayForTypedArray (
        typedArray
    ) {
        var buffer = typedArray.buffer;
        if (!buffer)
            throw new Error("typedArray must be a typed array");

        var result = NativeMemoryOperations.byteArrayCache.get(buffer);
        if (!result)
            NativeMemoryOperations.byteArrayCache.set(buffer, result = new Uint8Array(buffer, 0, buffer.byteLength));

        if (result.buffer !== buffer)
            throw new Error("what");

        return result;
    };

    /*
        Attempts to perfectly match C memcpy semantics.
        NativeMemoryOperations.memcpy(ARR1, ptr1, ARR2, ptr2, count) is equivalent to memcpy(&ARR1[ptr1], &ARR2[ptr2], count).
        destTypedArray and sourceTypedArray are treated as byte pointers (their respective type(s) are ignored).
        destOffsetInBytes and sourceOffsetInBytes are relative to the beginning of the specified typed arrays (not their buffers).
        Polyfills must be installed.
    */
    NativeMemoryOperations.memcpy = function memcpy (
        destTypedArray, destOffsetInBytes, 
        sourceTypedArray, sourceOffsetInBytes, countInBytes
    ) {
        var destArray = NativeMemoryOperations.getByteArrayForTypedArray(destTypedArray);
        var sourceArray = NativeMemoryOperations.getByteArrayForTypedArray(sourceTypedArray);

        destOffsetInBytes = (destOffsetInBytes + destTypedArray.byteOffset) | 0;
        sourceOffsetInBytes = (sourceOffsetInBytes + sourceTypedArray.byteOffset) | 0;
        countInBytes = countInBytes | 0;

        var endOffsetInBytes = (sourceOffsetInBytes + countInBytes) | 0;

        destArray.moveRange(
            destOffsetInBytes, 
            sourceArray, sourceOffsetInBytes, endOffsetInBytes
        );
    };

    /*
        Attempts to perfectly match C memset semantics.
        NativeMemoryOperations.memset(ARR, ptr, value, count) is equivalent to memset(&ARR[ptr], value, count).
        destTypedArray is treated as a byte pointer (its element type is ignored).
        destOffsetInBytes is relative to the beginning of the specified typed array (not its buffer).
        valueByte is masked into the range of a uint8 (unsigned char).
        Polyfills must be installed.
    */
    NativeMemoryOperations.memset = function memset (
        destTypedArray, destOffsetInBytes, 
        valueByte, countInBytes
    ) {
        var destArray = NativeMemoryOperations.getByteArrayForTypedArray(destTypedArray);

        destOffsetInBytes = (destOffsetInBytes + destTypedArray.byteOffset) | 0;
        countInBytes = countInBytes | 0;
        valueByte = valueByte & 0xFF;

        var endOffsetInBytes = (destOffsetInBytes + countInBytes) | 0;

        destArray.setRange(
            destOffsetInBytes, endOffsetInBytes, valueByte
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

        var copyForwards = true;

        if (this === sourceTypedArray) {
            if (destOffsetInElements === sourceStartOffsetInElements)
                return;
            else
                copyForwards = (sourceStartOffsetInElements > destOffsetInElements);
        }

        if (copyForwards) {
            for (var sourceOffset = sourceStartOffsetInElements, destOffset = destOffsetInElements; 
                sourceOffset < sourceEndOffsetInElements;
                sourceOffset = (sourceOffset + 1) | 0, destOffset = (destOffset + 1) | 0) {

                this[destOffset] = sourceTypedArray[sourceOffset];
            }
        } else {
            // This sucks. Wish it was (startOffset, count).
            var destEndOffsetInElements = (destOffsetInElements + (sourceEndOffsetInElements - sourceStartOffsetInElements)) | 0;

            for (var sourceOffset = sourceEndOffsetInElements - 1, destOffset = destEndOffsetInElements - 1; 
                sourceOffset >= sourceStartOffsetInElements;
                sourceOffset = (sourceOffset - 1) | 0, destOffset = (destOffset - 1) | 0) {

                this[destOffset] = sourceTypedArray[sourceOffset];
            }
        }
    }
    
    /* 
        TypedArray.prototype.setRange polyfill. |this| must be a Typed Array.
        Copies |value| to elements [startOffsetInElements, endOffsetInElements) of |this|.
    */
    NativeMemoryOperations.setRange = function setRange (
        startOffsetInElements, endOffsetInElements,
        value
    ) {
        if (endOffsetInElements < startOffsetInElements)
            throw new Error("End offset must be greater than or equal to start offset.");
        else if (endOffsetInElements === startOffsetInElements)
            return;

        var typedValue = (this[startOffsetInElements] = value);

        for (var offset = (startOffsetInElements + 1) | 0;
             offset < endOffsetInElements;
             offset = (offset + 1) | 0) {

            this[offset] = typedValue;
        }
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