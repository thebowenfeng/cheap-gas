import './App.css'
import {MapComponent} from "./map/map.tsx";
import {Dropdown} from "./common/components/dropdown.tsx";
import {type ComponentProps, useState} from "react";
import type {FuelType} from "./common/types.ts";

const FUEL_TYPES = [
    {
        label: 'Select an option',
        value: 'DESELECT'
    },
    {
        label: 'E10',
        value: 'E10'
    },
    {
        label: 'U91',
        value: 'U91'
    },
    {
        label: 'DIESEL',
        value: 'DIESEL'
    },
    {
        label: 'PremDSL',
        value: 'PremDSL'
    },
    {
        label: 'U95',
        value: 'U95'
    },
    {
        label: 'U98',
        value: 'U98'
    },
    {
        label: 'LPG',
        value: 'LPG'
    },
    {
        label: 'TruckDSL',
        value: 'TruckDSL'
    },
    {
        label: 'E85',
        value: 'E85'
    },
    {
        label: 'BIODIESEL',
        value: 'BIODIESEL'
    },
    {
        label: 'AdBlue',
        value: 'AdBlue'
    }
];

const App = () => {
    const [mapFilter, setMapFilter] = useState<ComponentProps<typeof MapComponent>['mapFilter']>(undefined);

    return (
      <>
        <div className="header-container">
          <Dropdown
              options={FUEL_TYPES}
              value={mapFilter?.gasTypeFilter}
              onValueChange={(value) => {
                  if (value !== 'DESELECT') {
                      setMapFilter((filter) => ({ ...filter, gasTypeFilter: value as FuelType }));
                  } else {
                      setMapFilter((filter) => ({ ...filter, gasTypeFilter: undefined }));
              }}}
          />
        </div>
        <MapComponent mapFilter={mapFilter} />
      </>
    )
}

export default App
