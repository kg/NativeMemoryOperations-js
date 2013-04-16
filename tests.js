module({
    NMO: 'NativeMemoryOperations.js',
}, function(imports) {
    NativeMemoryOperations.installPolyfills();

    function assertEqualArrays (a1, a2) {
        assert.deepEqual(Array.prototype.slice.call(a1), Array.prototype.slice.call(a2));
    };

    fixture("memcpy", function () {
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

        test("handles same-array move", function () {
            var a = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);

            var expected = new Uint8Array([0, 1, 2, 3, 0, 1, 2, 3]);

            NativeMemoryOperations.memcpy(a, 4, a, 0, 4);

            assertEqualArrays(expected, a);
        });

        test("handles same-array overlapping forwards move", function () {
            var a = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);

            var expected = new Uint8Array([0, 1, 0, 1, 2, 3, 4, 5]);

            NativeMemoryOperations.memcpy(a, 2, a, 0, 6);

            assertEqualArrays(expected, a);
        });

        test("handles same-array overlapping backwards move", function () {
            var a = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);

            var expected = new Uint8Array([2, 3, 4, 5, 6, 7, 6, 7]);

            NativeMemoryOperations.memcpy(a, 0, a, 2, 6);

            assertEqualArrays(expected, a);
        });

        test("unaligned copies work", function () {
            var a1 = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            var a2 = new Uint8Array(11);

            var expected = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2]);

            NativeMemoryOperations.memcpy(a2, 9, a1, 1, 3);

            assertEqualArrays(expected, a2);
        })
    });

    fixture("moveRange", function () {
        test("throws if arrays are not same type", function () {
            var a1 = new Uint8Array(8);
            var a2 = new Uint16Array(4);

            assert.throws(Error, function () {
                a2.moveRange(0, a1, 0, 4);
            });
        });
    });

    fixture("memset", function () {
        test("sets bytes", function () {
            var a = new Uint8Array(8);

            var expected = new Uint8Array([0, 4, 4, 4, 4, 4, 4, 0]);

            NativeMemoryOperations.memset(a, 1, 4, 6);

            assertEqualArrays(expected, a);
        });

        test("masks values to bytes", function () {
            var a = new Uint8Array(8);

            var expected = new Uint8Array([0, 210, 210, 210, 210, 210, 210, 0]);

            NativeMemoryOperations.memset(a, 1, 1234, 6);

            assertEqualArrays(expected, a);
        });

        test("throws if count is negative", function () {
            var a = new Uint8Array(8);

            assert.throws(Error, function () {
                NativeMemoryOperations.memset(a, 0, 0, -1);
            });
        });

        test("throws if start offset is negative", function () {
            var a = new Uint8Array(8);

            assert.throws(Error, function () {
                NativeMemoryOperations.memset(a, -32, 0, 8);
            });
        });

        test("throws if count exceeds size of array", function () {
            var a = new Uint8Array(8);

            assert.throws(Error, function () {
                NativeMemoryOperations.memset(a, 0, 0, 32);
            });
        });
    });

    fixture("setRange", function () {
        test("sets values", function () {
            var a = new Float32Array(8);

            var f = 0.1;
            var expected = new Float32Array([0, f, f, f, f, f, f, 0]);

            a.setRange(1, 7, f);

            assertEqualArrays(expected, a);
        });
    });
});