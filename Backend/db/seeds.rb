# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Usuario.create!(
  nome: 'khronos_adm',
  usuario: 'khronos_adm',
  senha: '749b6911bf2bbd920781343120d2d4603db44d5958555cbea16e241a8098639a',
  email: 'admin@admin.com.br',
  ativo: true,
  recomendante: true,
  operador: true
)