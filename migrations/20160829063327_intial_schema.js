
exports.up = function(knex, Promise) {
  return knex.schema.createTable('folders', folders => {
    folders.increments('id');
    folders.integer('parent_folder_id').unsigned().references('id').inTable('folders').onDelete('CASCADE');
    folders.string('name');
    folders.datetime('created_at').defaultTo(knex.fn.now());
    folders.datetime('updated_at').defaultTo(knex.fn.now());
  }).then(() => {
    return knex.schema.createTable('photos', photos => {
      photos.increments('id');
      photos.integer('folder_id').unsigned().references('id').inTable('folders').onDelete('CASCADE');
      photos.string('name');
      photos.text('description');
      photos.date('taken_at');
      photos.datetime('created_at').defaultTo(knex.fn.now());
      photos.datetime('updated_at').defaultTo(knex.fn.now());
    });
  }).then(() => {
    return knex.schema.createTable('photo_versions', photoVersions => {
      photoVersions.increments('id');
      photoVersions.integer('photo_id').unsigned().references('id').inTable('photos').onDelete('CASCADE');
      photoVersions.string('full_url');
      photoVersions.string('preview_url');
      photoVersions.datetime('uploaded_at');
    });
  }).then(() => {
    return knex.schema.table('photos', photos => {
      photos.integer('active_photo_id').unsigned().references('id').inTable('photo_versions').onDelete('SET NULL');
    });
  });
};

exports.down = function(knex, Promise) {
  let sql = 'ALTER TABLE photos DROP FOREIGN KEY photos_active_photo_id_foreign';
  return knex.schema.raw(sql).then(() => {
    return knex.schema.dropTable('photo_versions');
  }).then(() => {
    return knex.schema.dropTable('photos');
  }).then(() => {
    return knex.schema.dropTable('folders');
  });
};