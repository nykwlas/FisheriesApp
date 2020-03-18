class Place {
  constructor(id, title, imageUri, lat, lng, ownerId) {
    //address
    this.id = id;
    this.title = title;
    this.imageUri = imageUri;
    // this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.ownerId = ownerId;
  }
}

export default Place;
