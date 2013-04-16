/*
    Native memory operations JS polyfill v2
    by Kevin Gadd (@antumbral, kevin.gadd@gmail.com)

    https://github.com/kevingadd/NativeMemoryOperations-js
    Released under the MIT open source license.

    To use, call NativeMemoryOperations.installPolyfills() to make the polyfills available.
    You may then use NativeMemoryOperations.memcpy and NativeMemoryOperations.memset for convenience,
        or use the new TypedArray moveRange and fillRange methods.
*/

if (typeof (NativeMemoryOperations) === "undefined") {
    var NativeMemoryOperations = Object.create(null);

    if (typeof (WeakMap) !== "undefined") {
        NativeMemoryOperations.byteArrayCache = new WeakMap();
        NativeMemoryOperations.uint32ArrayCache = new WeakMap();
    } else {
        // throw new Error("WeakMaps are required");
        NativeMemoryOperations.byteArrayCache = null;
        NativeMemoryOperations.uint32ArrayCache = null;
    }

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

        if (NativeMemoryOperations.byteArrayCache) {
            var result = NativeMemoryOperations.byteArrayCache.get(buffer);
            if (!result)
                NativeMemoryOperations.byteArrayCache.set(buffer, result = new Uint8Array(buffer, 0, buffer.byteLength));
        } else {
            var result = new Uint8Array(buffer, 0, buffer.byteLength)
        }

        return result;
    };

    /*
        For the given typed array, returns a Uint32Array pointing at its underlying buffer.
        The returned Uint32Array always has an offset of 0 and a length equal to the length of the buffer.
        The array will be cached where possible to reduce GC pressure.
    */
    NativeMemoryOperations.getUint32ArrayForTypedArray = function getUint32ArrayForTypedArray (
        typedArray
    ) {
        var buffer = typedArray.buffer;
        if (!buffer)
            throw new Error("typedArray must be a typed array");
        else if ((buffer.byteLength >> 2) << 2 !== buffer.byteLength)
            throw new Error("typedArray's underlying buffer must have a length that is a multiple of 4");

        if (NativeMemoryOperations.uint32ArrayCache) {
            var result = NativeMemoryOperations.uint32ArrayCache.get(buffer);
            if (!result)
                NativeMemoryOperations.uint32ArrayCache.set(buffer, result = new Uint32Array(buffer, 0, buffer.byteLength >> 2));
        } else {
            var result = new Uint32Array(buffer, 0, buffer.byteLength >> 2);
        }

        return result;
    };

    /*
        Attempts to perfectly match C memcpy semantics.
        NativeMemoryOperations.memcpy(ARR1, ptr1, ARR2, ptr2, count) is equivalent to memcpy(&ARR1[ptr1], &ARR2[ptr2], count).
        destTypedArray and sourceTypedArray are treated as pointers (their respective type(s) are ignored).
        destOffsetInElements and sourceOffsetInElements are relative to the beginning of the specified typed arrays (not their buffers).
        Polyfills must be installed.
    */
    NativeMemoryOperations.memcpy = function memcpy (
        destTypedArray, destOffsetInElements, 
        sourceTypedArray, sourceOffsetInElements, countInBytes
    ) {
        countInBytes = countInBytes | 0;
        var destOffsetInBytes = ((destOffsetInElements * destTypedArray.BYTES_PER_ELEMENT) + destTypedArray.byteOffset) | 0;
        var sourceOffsetInBytes = ((sourceOffsetInElements * sourceTypedArray.BYTES_PER_ELEMENT) + sourceTypedArray.byteOffset) | 0;

        var sourceEndOffsetInBytes = (sourceOffsetInBytes + countInBytes) | 0;

        var destOffsetInElements = destOffsetInBytes >> 2;
        var sourceOffsetInElements = sourceOffsetInBytes >> 2;
        var sourceEndOffsetInElements = sourceEndOffsetInBytes >> 2;

        if (
            // The offsets must be multiples of 4.
            (destOffsetInElements << 2 == destOffsetInBytes) &&
            (sourceOffsetInElements << 2 == sourceOffsetInBytes) &&
            (sourceEndOffsetInElements << 2 == sourceEndOffsetInBytes) &&
            // The typed arrays' size must be a multiple of 4.
            ((destTypedArray.buffer.byteLength >> 2) << 2 === destTypedArray.buffer.byteLength) &&
            ((sourceTypedArray.buffer.byteLength >> 2) << 2 === sourceTypedArray.buffer.byteLength)
        ) {
            // Do a fast copy in 4-byte units.
            var destArray = NativeMemoryOperations.getUint32ArrayForTypedArray(destTypedArray);
            var sourceArray = NativeMemoryOperations.getUint32ArrayForTypedArray(sourceTypedArray);

            destArray.moveRange(
                destOffsetInElements, 
                sourceArray, sourceOffsetInElements, sourceEndOffsetInElements
            );
        } else {
            var destArray = NativeMemoryOperations.getByteArrayForTypedArray(destTypedArray);
            var sourceArray = NativeMemoryOperations.getByteArrayForTypedArray(sourceTypedArray);

            destArray.moveRange(
                destOffsetInBytes, 
                sourceArray, sourceOffsetInBytes, sourceEndOffsetInBytes
            );
        }
    };

    /*
        Attempts to perfectly match C memset semantics.
        NativeMemoryOperations.memset(ARR, ptr, value, count) is equivalent to memset(&ARR[ptr], value, count).
        destTypedArray is treated as a pointer (its element type is ignored).
        destOffsetInElements is relative to the beginning of the specified typed array (not its buffer).
        valueByte is masked into the range of a uint8 (unsigned char).
        Polyfills must be installed.
    */
    NativeMemoryOperations.memset = function memset (
        destTypedArray, destOffsetInElements, 
        valueByte, countInBytes
    ) {
        var destArray = NativeMemoryOperations.getByteArrayForTypedArray(destTypedArray);

        var destOffsetInBytes = ((destOffsetInElements * destTypedArray.BYTES_PER_ELEMENT) + destTypedArray.byteOffset) | 0;
        countInBytes = countInBytes | 0;
        valueByte = valueByte & 0xFF;

        var endOffsetInBytes = (destOffsetInBytes + countInBytes) | 0;

        destArray.fillRange(
            destOffsetInBytes, endOffsetInBytes, valueByte
        );
    };

    /*
        Installs moveRange and setRange into the prototype of the given typed array.
        If native versions of the methods already exist, they will not be overwritten.
        It's important to generate separate copies of the polyfills for each typed array type,
            because otherwise the inline caches will have polluted type information.
    */
    NativeMemoryOperations.installPolyfillsIntoPrototype = function (prototype) {    

        /* 
            TypedArray.prototype.moveRange polyfill. 
            |this| must be a Typed Array of the same type as |sourceTypedArray|.
            Copies elements [sourceStartOffsetInElements, sourceEndOffsetInElements) to |this| starting at destOffsetInElements.
            sourceEndOffsetInElements must >= sourceStartOffsetInElements.
        */
        if (typeof (prototype.moveRange) !== "function")
        prototype.moveRange = function moveRange (
            destOffsetInElements, 
            sourceTypedArray, sourceStartOffsetInElements, sourceEndOffsetInElements
        ) {
            // This sucks. Wish it was (startOffset, count).
            var destEndOffsetInElements = (destOffsetInElements + (sourceEndOffsetInElements - sourceStartOffsetInElements)) | 0;

            if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(sourceTypedArray))
                throw new Error("Source and destination typed arrays must be of the same type.");
            else if (sourceEndOffsetInElements < sourceStartOffsetInElements)
                throw new Error("End offset must be greater than or equal to start offset.");
            else if (sourceEndOffsetInElements > sourceTypedArray.length)
                throw new Error("Source end offset must be less than or equal to length of source array.");
            else if (sourceStartOffsetInElements < 0)
                throw new Error("Source start offset must not be negative.");
            else if (destOffsetInElements < 0)
                throw new Error("Destination offset must not be negative.");
            else if (destEndOffsetInElements > this.length)
                throw new Error("Destination end offset must be less than or equal to length of destination array.");

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

                for (var sourceOffset = sourceEndOffsetInElements - 1, destOffset = destEndOffsetInElements - 1; 
                    sourceOffset >= sourceStartOffsetInElements;
                    sourceOffset = (sourceOffset - 1) | 0, destOffset = (destOffset - 1) | 0) {

                    this[destOffset] = sourceTypedArray[sourceOffset];
                }
            }
        }
        
        /* 
            TypedArray.prototype.fillRange polyfill. |this| must be a Typed Array.
            Copies |value| to elements [startOffsetInElements, endOffsetInElements) of |this|.
        */
        if (typeof (prototype.fillRange) !== "function")
        prototype.fillRange = function fillRange (
            startOffsetInElements, endOffsetInElements,
            value
        ) {
            if (endOffsetInElements < startOffsetInElements)
                throw new Error("End offset must be greater than or equal to start offset.");
            else if (endOffsetInElements > this.length)
                throw new Error("End offset must be less than or equal to length of array.");
            else if (startOffsetInElements < 0)
                throw new Error("Start offset must not be negative.");
            else if (endOffsetInElements === startOffsetInElements)
                return;

            var typedValue = (this[startOffsetInElements] = value);

            for (var offset = (startOffsetInElements + 1) | 0;
                 offset < endOffsetInElements;
                 offset = (offset + 1) | 0) {

                this[offset] = typedValue;
            }
        }
    };
    
    /*
        Installs TypedArray.prototype.moveRange and TypedArray.prototype.fillRange
        polyfills if not implemented natively.
    */
    NativeMemoryOperations.installPolyfills = function () {
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
            NativeMemoryOperations.installPolyfillsIntoPrototype(typedArrayProto);
        }
    };

};