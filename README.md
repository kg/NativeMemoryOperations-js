JS Native Memory Operations
===========================

Provides simple C-style memcpy and memset functions, along with polyfills for similar methods on Typed Array instances.
The intent is that the Typed Array methods will become a part of the specification and implemented natively. For browsers in which they are not available, JS implementations are provided automatically.

Usage
=====
Include NativeMemoryOperations.js in your application and call NativeMemoryOperations.installPolyfills().

For non-legacy uses, simply use the new moveRange and fillRange methods added to the typed array prototypes:

	// Copies elements from sourceTypedArray to this.
	TypedArray.moveRange(destinationOffsetInElements, sourceTypedArray, sourceStartOffsetInElements, sourceEndOffsetInElements)

	// Fills a range of this with value.
	TypedArray.fillRange(startOffsetInElements, endOffsetInElements, value)

NativeMemoryOperations.memcpy and NativeMemoryOperations.memset attempt to perfectly match the semantics of their C equivalents:
	* destination and source can be arbitrary byte offsets (they do not need to be aligned)
	* counts are in bytes.
	* memset writes out bytes.
The pointer dest/src arguments to memcpy/memset are replaced with (typed array, offset in elements) pairs. 

The equivalent of:

	memcpy(&a1[x], &a2[y], countBytes)

is:

	NativeMemoryOperations.memcpy(a1, x, a2, y, countBytes)

The equivalent of:

	memset(&arr[x], valueByte, countBytes)

is:

	NativeMemoryOperations.memset(arr, x, valueByte, countBytes)

License
=======

Copyright 2013 Kevin Gadd

License: MIT