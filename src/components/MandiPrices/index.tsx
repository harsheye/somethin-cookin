import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MandiPriceProps {
  userDistrict?: string;
  userState?: string;
}

interface MandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

const MandiPrices: React.FC<MandiPriceProps> = ({ userDistrict, userState }) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedState, setSelectedState] = useState(userState || '');
  const [selectedDistrict, setSelectedDistrict] = useState(userDistrict || '');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [dateRange, setDateRange] = useState('7'); // days
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const fetchMandiPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        'api-key': '579b464db66ec23bdd0000013898a40aa2eb4db15ab16dee8c5dfbad',
        format: 'json',
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString(),
      });

      // Add filters
      if (selectedDistrict) {
        params.append('filters[District.keyword]', selectedDistrict);
      } else if (selectedState) {
        params.append('filters[State.keyword]', selectedState);
      }

      if (selectedCommodity) {
        params.append('filters[Commodity.keyword]', selectedCommodity);
      }

      // Date filter
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - parseInt(dateRange));
      params.append('filters[Arrival_Date]', fromDate.toISOString().split('T')[0]);

      const response = await fetch(
        `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch mandi prices');
      }

      const data = await response.json();
      setPrices(data.records);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      console.error('Error fetching mandi prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiPrices();
  }, [currentPage, itemsPerPage, selectedState, selectedDistrict, selectedCommodity, dateRange]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
            className="w-full"
          >
            <option value="">All States</option>
            {/* Add state options */}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <Select
            value={selectedDistrict}
            onValueChange={setSelectedDistrict}
            className="w-full"
          >
            <option value="">All Districts</option>
            {/* Add district options */}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Commodity</label>
          <Select
            value={selectedCommodity}
            onValueChange={setSelectedCommodity}
            className="w-full"
          >
            <option value="">All Commodities</option>
            {/* Add commodity options */}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Range (days)</label>
          <Select
            value={dateRange}
            onValueChange={setDateRange}
            className="w-full"
          >
            <option value="7">Last 7 days</option>
            <option value="15">Last 15 days</option>
            <option value="30">Last 30 days</option>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>District</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Min Price (₹)</TableHead>
                <TableHead className="text-right">Max Price (₹)</TableHead>
                <TableHead className="text-right">Modal Price (₹)</TableHead>
                <TableHead>Arrival Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : prices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                prices.map((price, index) => (
                  <TableRow key={index}>
                    <TableCell>{price.commodity}</TableCell>
                    <TableCell>{price.variety}</TableCell>
                    <TableCell>{price.market}</TableCell>
                    <TableCell>{price.district}</TableCell>
                    <TableCell>{price.state}</TableCell>
                    <TableCell className="text-right">{price.min_price}</TableCell>
                    <TableCell className="text-right">{price.max_price}</TableCell>
                    <TableCell className="text-right">{price.modal_price}</TableCell>
                    <TableCell>{new Date(price.arrival_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
              className="w-20"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Select>
            <span className="text-sm text-gray-600">items per page</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiPrices; 