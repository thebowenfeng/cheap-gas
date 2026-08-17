import './App.css'
import {MapComponent} from "./map/map.tsx";
import {Dropdown} from "./common/components/dropdown.tsx";
import {type ComponentProps, useState} from "react";
import type {Coordinate, FuelType} from "./common/types.ts";
import {GPS} from "./gps/gps.tsx";

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
const FILTER_TYPES = [
    {
        label: 'Select an option',
        value: 'DESELECT'
    },
    {
        label: 'My location',
        value: 'GPS'
    }
];

const mapFilterToFilterType = (mapFilter: ComponentProps<typeof MapComponent>['mapFilter']) => {
    if (mapFilter?.gpsLocationFilter) {
        return 'GPS';
    }
    return undefined;
}

const App = () => {
    const [mapFilter, setMapFilter] = useState<ComponentProps<typeof MapComponent>['mapFilter']>(undefined);
    const [currPos, setCurrPos] = useState<Coordinate | undefined>(undefined);

    return (
      <>
          <div className="header-container">
              <Dropdown
                  options={FILTER_TYPES}
                  value={mapFilterToFilterType(mapFilter)}
                  onValueChange={(value) => {
                      if (value !== 'DESELECT') {
                          setMapFilter((filter) => ({ ...filter, gpsLocationFilter: currPos }));
                      } else {
                          setMapFilter((filter) => ({ ...filter, gpsLocationFilter: undefined }));
                      }
                  }}
              />
              <Dropdown
                  options={FUEL_TYPES}
                  value={mapFilter?.gasTypeFilter}
                  onValueChange={(value) => {
                      if (value !== 'DESELECT') {
                          setMapFilter((filter) => ({ ...filter, gasTypeFilter: value as FuelType }));
                      } else {
                          setMapFilter((filter) => ({ ...filter, gasTypeFilter: undefined }));
                      }
                  }}
              />
          </div>
          <MapComponent mapFilter={mapFilter} />
          <GPS
              onLocationChange={(pos) => {
                  setCurrPos(pos);
              }}
              onError={() => {
                  setCurrPos(undefined);
              }}
              interval={1000}
          />
      </>
    )
}

export default App
