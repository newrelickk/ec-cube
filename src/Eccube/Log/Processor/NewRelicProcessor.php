<?php
namespace Eccube\Log\Processor;

use Monolog\Processor\ProcessorInterface;

class NewRelicProcessor implements ProcessorInterface
{
    /**
     * Returns the given record with the New Relic linking metadata added
     * if a compatible New Relic extension is loaded, otherwise returns the
     * given record unmodified
     *
     * @param  array $record A Monolog record
     * @return array Given record, with New Relic metadata added if available
     */
    public function __invoke(array $record)
    {
        if ($this->contextAvailable()) {
            $linking_data = newrelic_get_linking_metadata();
            // NR-LINKING|{entity.guid}|{hostname}|{trace.id}|{span.id}|{entity.name}|
            $record['extra']['newrelic-context'] = [];
            $record['extra']['entityGuid'] = isset($linking_data['entity.guid']) ? $linking_data['entity.guid'] : '';
            $record['extra']['hostname'] = isset($linking_data['hostname']) ? $linking_data['hostname'] : '';
            $record['extra']['traceId'] = isset($linking_data['trace.id']) ? $linking_data['trace.id'] : '';
            $record['extra']['spanId'] = isset($linking_data['span.id']) ? $linking_data['span.id'] : '';
            $record['extra']['entityName'] = isset($linking_data['entity.name']) ? $linking_data['entity.name'] : '';
        }
        return $record;
    }

    /**
     * Checks if a compatible New Relic extension (v9.3 or higher) is loaded
     *
     * @return bool
     */
    protected function contextAvailable()
    {
        return function_exists('newrelic_get_linking_metadata');
    }
}
