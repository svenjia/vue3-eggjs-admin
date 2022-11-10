module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('config')
  const GiftSchema = new Schema(
    { item_type: Number, item_idx: Number, num: Number },
    { _id: false }
  )
  const BagItemSchema = new Schema(
    {
      idx: Number,
      name: Number,
      desc: Number,
      icon: String,
      show: Boolean,
      send: Boolean,
      expire: Number,
      stack: Boolean,
      priority: Number,
      new_notice: Boolean,
      expire_notice: Boolean,
      type: Number,
      ex_type: Number,
      //   gift_items: [Schema.Types.Mixed],
      gift_items: [GiftSchema],
      combine: {
        param_1: Number,
        param_2: Number
      },
      coupon_param: {
        coupon_type: Number,
        param_1: Number,
        param_2: Number
      }
    },
    { collection: 'CFG_BagItem', versionKey: false, }
  )
  return conn.model('BagItem', BagItemSchema)
}
