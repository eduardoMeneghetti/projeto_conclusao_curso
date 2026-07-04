# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Usuario.find_or_create_by!(usuario: 'khronos_adm') do |u|
  u.nome        = 'khronos_adm'
  u.senha       = '749b6911bf2bbd920781343120d2d4603db44d5958555cbea16e241a8098639a'
  u.email       = 'admin@admin.com.br'
  u.ativo       = true
  u.recomendante = true
  u.operador    = true
end

unless Estado.any?
  puts 'Inserindo estados...'
  now = Time.current
  estados_json = JSON.parse(
    File.read(Rails.root.join('app/assets/JSON/estados.json'), encoding: 'bom|utf-8')
  )
  Estado.insert_all!(
    estados_json.map { |e| { descricao: e['nome'], sigla: e['uf'], codigo_ibge: e['codigo_uf'], created_at: now, updated_at: now } }
  )
  puts "  #{Estado.count} estados inseridos."

  puts 'Inserindo cidades...'
  municipios_json = JSON.parse(
    File.read(Rails.root.join('app/assets/JSON/municipios.json'), encoding: 'bom|utf-8')
  )
  estado_map = Estado.pluck(:codigo_ibge, :id).to_h
  Cidade.insert_all!(
    municipios_json.filter_map do |m|
      estado_id = estado_map[m['codigo_uf']]
      next unless estado_id
      { descricao: m['nome'], codigo_ibge: m['codigo_ibge'], latitude: m['latitude'], longitude: m['longitude'], estado_id: estado_id, created_at: now, updated_at: now }
    end
  )
  puts "  #{Cidade.count} cidades inseridas."
end