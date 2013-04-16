module({
    NMO: 'NativeMemoryOperations.js',
}, function(imports) {
    NativeMemoryOperations.installPolyfills();

    function assertEqualArrays (a1, a2) {
        assert.deepEqual(Array.prototype.slice.call(a1), Array.prototype.slice.call(a2));
    };

    test("copies bytes", function () {
        var a1 = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
        var a2 = new Uint8Array(8);

        NativeMemoryOperations.memcpy(a1, 0, a2, 0, a1.length);

        assertEqualArrays(a1, a2);        
    });
});