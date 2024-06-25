import pako from 'pako';

export function compress(object: unknown) {
  try {
    const zippedObject = pako.gzip(JSON.stringify(object));
    const codedToCharObject = String.fromCharCode.apply(
      null,
      Array.from(zippedObject)
    );
    const codedBase64Object = btoa(codedToCharObject).replaceAll('+', '%2b');
    return codedBase64Object;
  } catch {
    console.error("ERROR: compressed error");
    return '';
  }
}

export function decompress(codedBase64Object: string) {
  try {
    const decodedBase64Object = atob(codedBase64Object);
    const decodedToCharObject = decodedBase64Object
      .split('')
      .map((el) => el.charCodeAt(0));
    const dezippedObject = pako.inflate(new Uint8Array(decodedToCharObject));
    const decodedObject = new TextDecoder().decode(dezippedObject);
    return decodedObject;
  } catch {
    console.error("ERROR: decompressed error");
    return '{}';
  }
}
