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

        var expected = new Uint8Array(a1);

        NativeMemoryOperations.memcpy(a2, 0, a1, 0, a1.length);

        assertEqualArrays(expected, a2);
    });

    test("copies nothing if count is 0", function () {
        var a1 = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
        var a2 = new Uint8Array(8);

        var expected = new Uint8Array(a2);

        NativeMemoryOperations.memcpy(a2, 0, a1, 0, 0);

        assertEqualArrays(expected, a2);
    });

    test("copies subset of bytes", function () {
        var a1 = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
        var a2 = new Uint8Array(8);

        var expected = new Uint8Array([0, 1, 2, 3, 0, 0, 0, 0]);

        NativeMemoryOperations.memcpy(a2, 0, a1, 0, 4);

        assertEqualArrays(expected, a2);
    });

    test("throws if count is negative", function () {
        var a = new Uint8Array(8);

        assert.throws(Error, function () {
            NativeMemoryOperations.memcpy(a, 0, a, 0, -1);
        });
    });
});