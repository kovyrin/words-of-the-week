# frozen_string_literal: true

require 'functions_framework'

PASSWORD = 'Iewee1ohshaiNgeekadeiYue7fu4Oot5'

# https://cloud.google.com/text-to-speech/docs/voices
VOICES = {
  'fr' => {
    'female' => {
      language_code: 'fr-CA',
      name: 'fr-CA-Neural2-A'
    },
    'male' => {
      language_code: 'fr-CA',
      name: 'fr-CA-Neural2-B'
    }
  },
  'en' => {
    'female' => {
      language_code: 'en-US',
      name: 'en-US-Neural2-C'
    },
    'male' => {
      language_code: 'en-US',
      name: 'en-US-Neural2-D'
    }
  }
}.freeze

#------------------------------------------------------------------------------
def bad_request(message)
  [
    400,
    { 'Content-Type' => 'text/html' },
    ["Bad Request: #{message}"]
  ]
end

#------------------------------------------------------------------------------
def tts(query)
  text = query['text']
  return bad_request('text parameter is missing') if text.nil? || text.empty?

  language = query['language'] || 'fr'
  voices = VOICES[language]
  return bad_request("language #{language} is not supported") unless voices

  gender = query['gender'] || 'male'
  voice = voices[gender]
  return bad_request("unsupported gender #{gender} for #{language} language") unless voice

  tts_client = global(:tts_client)

  result = tts_client.synthesize_speech(
    input: { text: },
    voice:,
    audio_config: { audio_encoding: 'MP3' }
  )

  [200, { 'Content-Type' => 'audio/mpeg' }, [result.audio_content]]
end

#------------------------------------------------------------------------------
FunctionsFramework.on_startup do
  require 'google/cloud/text_to_speech'

  Google::Cloud::TextToSpeech.configure do |config|
    config.credentials = 'tts-credentials.json' if File.file?('tts-credentials.json')
  end

  set_global :tts_client, Google::Cloud::TextToSpeech.text_to_speech
end

FunctionsFramework.http('tts') do |request|
  query = Rack::Utils.parse_nested_query(request.query_string)
  request.logger.info(query)

  password = query['password']
  return bad_request('password is missing or incorrect') unless password == PASSWORD

  tts(query)
end
