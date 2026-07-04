namespace :db do
  desc 'Popula estados e cidades a partir dos JSONs — só executa se o banco estiver vazio'
  task seed_cidades: :environment do
    if Estado.any?
      puts "Estados já existem (#{Estado.count} registros). Pulando seed."
      next
    end

    now = Time.current

    puts "Inserindo estados..."
    estados_json = JSON.parse(
      File.read(Rails.root.join('app/assets/JSON/estados.json'), encoding: 'bom|utf-8')
    )

    Estado.insert_all!(
      estados_json.map do |e|
        {
          descricao:    e['nome'],
          sigla:        e['uf'],
          codigo_ibge:  e['codigo_uf'],
          created_at:   now,
          updated_at:   now
        }
      end
    )
    puts "  #{Estado.count} estados inseridos."

    puts "Inserindo cidades..."
    municipios_json = JSON.parse(
      File.read(Rails.root.join('app/assets/JSON/municipios.json'), encoding: 'bom|utf-8')
    )

    estado_map = Estado.pluck(:codigo_ibge, :id).to_h

    cidades_data = municipios_json.filter_map do |m|
      estado_id = estado_map[m['codigo_uf']]
      next unless estado_id

      {
        descricao:    m['nome'],
        codigo_ibge:  m['codigo_ibge'],
        latitude:     m['latitude'],
        longitude:    m['longitude'],
        estado_id:    estado_id,
        created_at:   now,
        updated_at:   now
      }
    end

    Cidade.insert_all!(cidades_data)
    puts "  #{Cidade.count} cidades inseridas."
    puts "Seed concluído!"
  end
end
