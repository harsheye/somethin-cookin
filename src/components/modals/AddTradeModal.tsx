import AutumnSelect from '@/components/ui/AutumnSelect';
import AutumnCalendar from '@/components/ui/AutumnCalendar';

const AddTradeModal = ({ isOpen, onClose }: AddTradeModalProps) => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    price: '',
    description: '',
    tradeDate: new Date(),
    location: '',
    category: '',
    isActive: true
  });

  const categories = [
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Grains', value: 'grains' },
    { label: 'Spices', value: 'spices' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <form className="space-y-6">
          {/* ... other fields ... */}

          <AutumnSelect
            label="Category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            options={categories}
            placeholder="Select a category"
          />

          <AutumnCalendar
            label="Trade Date"
            selected={formData.tradeDate}
            onChange={(date) => setFormData({ ...formData, tradeDate: date })}
          />

          {/* ... rest of the form ... */}
        </form>
      </div>
    </Modal>
  );
};

export default AddTradeModal; 