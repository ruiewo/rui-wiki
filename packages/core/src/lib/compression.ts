function deflateEncode(data: Uint8Array) {
  return new Response(
    new Blob([data]).stream().pipeThrough(new CompressionStream('deflate'))
  ).arrayBuffer();
}

function deflateDecode(data: Uint8Array) {
  return new Response(
    new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate'))
  ).arrayBuffer();
}
