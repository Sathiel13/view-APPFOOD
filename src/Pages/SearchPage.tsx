import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import SearchResultsInfo from "@/components/SearchResultsInfo";
import SortOptionsDropdown from "@/components/SortOptionsDropdown";
import { useState } from "react";
import { useParams } from "react-router-dom"

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOptions: string;
}

export default function SearchPage() {
    const { city } = useParams();
    const [searchState, setSearchState] = useState<SearchState>({
      searchQuery:"",
      page: 1,
      selectedCuisines: [],
      sortOptions: "bestMatch"
    })

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const { results, isLoading } = useSearchRestaurants(searchState, city);

    const setSortOptions = (sortOptions: string) => {
      setSearchState((prevState) => ({
        ...prevState,
        sortOptions,
        page: 1
      }))
    }; //Fin de setSortOptions

    const setSelectedCuisines = (selectedCuisines: string[]) => {
      setSearchState( (prevstate)=>({
        ...prevstate,
        selectedCuisines,
        page: 1,
      }))
    }; //Fin de selectedCuisines

    const setPage = (page: number) => {
      setSearchState( (prevstate) => ({
        ...prevstate,
        page,
      }))
    }//Fin de setPage
    
    const setSearchQuery = (searchFormData: SearchForm) => {
      setSearchState((prevState) => ({
        ...prevState,
        searchQuery: searchFormData.searchQuery,
        page: 1,
      }))
    } //Fin de setSearchQuery

    const resetSearch = () => {
      setSearchState((prevState) => ({
        ...prevState,
        searchQuery: "",
        page: 1,
      }))
    }//Fin de resetSearch

    if (isLoading) {
        <span>Loading...</span>
    }
    if (!results?.data || !city) {
        return <span>No hay resultados</span>
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        <div id="cuisines-list">
          <CuisineFilter
            selectedCuisines={searchState.selectedCuisines}
            onChange={setSelectedCuisines}
            isExpanded={isExpanded}
            onExpandedClick={()=>setIsExpanded( (prevIsExpanded)=>!prevIsExpanded)}
          />
        </div>
        <div id="main-content"
             className="flex flex-col gap-5">
              <SearchBar 
                         searchQuery={searchState.searchQuery}
                         onSubmit={setSearchQuery}
                         placeHolder="Busqueda por cocina o nombre del restaurante"
                         onReset={resetSearch}
              />
              <div className="flex justify-between flex-col gap-3 lg:flex-row">
                <SearchResultsInfo
                  total={results.pagination.total}
                  city={city}
                />
                <SortOptionsDropdown
                  sortOption = {searchState.sortOptions}
                  onChange = {(value) => setSortOptions(value)}
                />
              </div>
                {
                  results.data.map((restaurant) => (
                    <SearchResultCard restaurant={restaurant}/>
                  ))
                }

                <PaginationSelector
                      page={results.pagination.page}
                      pages={results.pagination.pages}
                      onPageChane={setPage}
                />
        </div>
    </div>
  )
}
