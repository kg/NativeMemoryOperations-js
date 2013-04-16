JS Native Memory Operations
===========================

Provides simple C-style memcpy and memset functions, along with polyfills for similar methods on Typed Array instances.
The intent is that the Typed Array methods will become a part of the specification and implemented natively. For browsers in which they are not available, JS implementations are provided automatically.

Usage
=====
Include NativeMemoryOperations.js in your application and call NativeMemoryOperations.installPolyfills().

License
=======

Copyright 2013 Kevin Gadd
License: MIT