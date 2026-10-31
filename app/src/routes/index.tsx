import { createBrowserRouter } from 'react-router-dom'
import { HomeScreen } from '@/features/home/HomeScreen'
import { ReferenceHomeScreen } from '@/features/reference/ReferenceHomeScreen'
import { ModelPickerScreen } from '@/features/reference/ModelPickerScreen'
import { VariantPickerScreen } from '@/features/reference/VariantPickerScreen'
import { VariantDetailScreen } from '@/features/reference/VariantDetailScreen'
import { SopListScreen } from '@/features/reference/SopListScreen'
import { SopDetailScreen } from '@/features/reference/SopDetailScreen'
import { FaultListScreen } from '@/features/reference/FaultListScreen'
import { SearchScreen } from '@/features/reference/SearchScreen'
import { InspectionsListScreen } from '@/features/inspections/InspectionsListScreen'
import { InspectionDetailScreen } from '@/features/inspections/InspectionDetailScreen'
import { StartInspectionScreen } from '@/features/inspections/StartInspectionScreen'
import { ServiceHomeScreen } from '@/features/service/ServiceHomeScreen'
import { ConfigureJobHomeScreen } from '@/features/configure/ConfigureJobHomeScreen'
import { GalvanizingHomeScreen } from '@/features/galvanizing/GalvanizingHomeScreen'
import { GalvanizingConfigScreen } from '@/features/galvanizing/GalvanizingConfigScreen'
import { GalvanizingChecklistScreen } from '@/features/galvanizing/GalvanizingChecklistScreen'

export const router = createBrowserRouter([
  { path: '/',                                                                 element: <HomeScreen /> },
  { path: '/reference',                                                        element: <ReferenceHomeScreen /> },
  { path: '/service',                                                          element: <ServiceHomeScreen /> },
  { path: '/configure-job',                                                    element: <ConfigureJobHomeScreen /> },
  { path: '/search',                                                           element: <SearchScreen /> },
  { path: '/faults',                                                           element: <FaultListScreen /> },
  { path: '/inspections',                                                      element: <InspectionsListScreen /> },
  { path: '/inspections/new',                                                  element: <StartInspectionScreen /> },
  { path: '/inspections/:inspectionId',                                        element: <InspectionDetailScreen /> },
  { path: '/galvanizing',                                                      element: <GalvanizingHomeScreen /> },
  { path: '/galvanizing/configure',                                            element: <GalvanizingConfigScreen /> },
  { path: '/galvanizing/:configId/edit',                                       element: <GalvanizingConfigScreen /> },
  { path: '/galvanizing/:configId',                                            element: <GalvanizingChecklistScreen /> },
  { path: '/:manufacturerId',                                                  element: <ModelPickerScreen /> },
  { path: '/:manufacturerId/sops',                                             element: <SopListScreen scope="manufacturer" /> },
  { path: '/:manufacturerId/sops/:sopId',                                      element: <SopDetailScreen /> },
  { path: '/:manufacturerId/:modelSlug',                                       element: <VariantPickerScreen /> },
  { path: '/:manufacturerId/:modelSlug/sops',                                  element: <SopListScreen scope="model" /> },
  { path: '/:manufacturerId/:modelSlug/sops/:sopId',                           element: <SopDetailScreen /> },
  { path: '/:manufacturerId/:modelSlug/:variantSlug',                          element: <VariantDetailScreen /> },
  { path: '/:manufacturerId/:modelSlug/:variantSlug/sops',                     element: <SopListScreen scope="variant" /> },
  { path: '/:manufacturerId/:modelSlug/:variantSlug/sops/:sopId',              element: <SopDetailScreen /> },
])
