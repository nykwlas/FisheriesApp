class Record {
  constructor(id, ownerId, title, imageUrl, description, date, catches) {
    this.id = id;
    this.ownerId = ownerId;
    this.imageUrl = imageUrl;
    this.title = title;
    this.description = description;
    this.date = date;
    this.catches = catches;
  }
}

export default Record;
