exports.up = function (migration, DataTypes, done) {
  migration.addColumn('products', 'active', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }).complete(done)
}