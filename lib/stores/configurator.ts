import { create } from 'zustand'
import { Vector3, Euler } from 'three'

export interface ConfiguratorItem {
  id: string
  productId: string
  name: string
  price: number
  position: Vector3
  rotation: Euler
  scale: Vector3
  modelUrl?: string
}

export interface TankConfig {
  width: number
  height: number
  depth: number
  glassType: 'standard' | 'low-iron' | 'tempered'
  cabinetColor: string
}

interface HistoryState {
  items: ConfiguratorItem[]
  tankConfig: TankConfig
  selectedItem: string | null
}

interface ConfiguratorState {
  items: ConfiguratorItem[]
  tankConfig: TankConfig
  totalPrice: number
  selectedItem: string | null
  cameraPosition: Vector3
  cameraTarget: Vector3
  
  // History tracking
  history: HistoryState[]
  historyIndex: number
  maxHistorySize: number
  
  // Actions
  addItem: (item: Omit<ConfiguratorItem, 'id'>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<ConfiguratorItem>) => void
  commitChanges: () => void
  setTankConfig: (config: Partial<TankConfig>) => void
  setSelectedItem: (id: string | null) => void
  setCameraPosition: (position: Vector3) => void
  setCameraTarget: (target: Vector3) => void
  calculateTotalPrice: () => void
  clearConfiguration: () => void
  loadConfiguration: (data: any) => void
  exportConfiguration: () => any
  
  // History actions
  saveToHistory: () => void
  initializeHistory: () => void
  undo: () => boolean
  redo: () => boolean
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  items: [],
  tankConfig: {
    width: 60,
    height: 40,
    depth: 35,
    glassType: 'standard',
    cabinetColor: '#8B4513'
  },
  totalPrice: 0,
  selectedItem: null,
  cameraPosition: new Vector3(100, 50, 100),
  cameraTarget: new Vector3(0, 0, 0),
  
  // History state
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  saveToHistory: () => {
    const state = get()
    const currentState: HistoryState = {
      items: JSON.parse(JSON.stringify(state.items.map(item => ({
        ...item,
        position: { x: item.position.x, y: item.position.y, z: item.position.z },
        rotation: { x: item.rotation.x, y: item.rotation.y, z: item.rotation.z },
        scale: { x: item.scale.x, y: item.scale.y, z: item.scale.z }
      })))),
      tankConfig: { ...state.tankConfig },
      selectedItem: state.selectedItem
    }
    
    // Remove any redo history if we're not at the end
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(currentState)
    
    // Limit history size
    if (newHistory.length > state.maxHistorySize) {
      newHistory.shift()
    } else {
      set({ historyIndex: state.historyIndex + 1 })
    }
    
    set({ history: newHistory })
  },

  initializeHistory: () => {
    // Save the initial state as the first history entry
    const state = get()
    if (state.history.length === 0) {
      get().saveToHistory()
    }
  },

  undo: () => {
    const state = get()
    if (state.historyIndex <= 0) return false
    
    const previousState = state.history[state.historyIndex - 1]
    
    // Restore Vector3 and Euler objects
    const restoredItems = previousState.items.map((item: any) => ({
      ...item,
      position: new Vector3(item.position.x, item.position.y, item.position.z),
      rotation: new Euler(item.rotation.x, item.rotation.y, item.rotation.z),
      scale: new Vector3(item.scale.x, item.scale.y, item.scale.z)
    }))
    
    set({
      items: restoredItems,
      tankConfig: previousState.tankConfig,
      selectedItem: previousState.selectedItem,
      historyIndex: state.historyIndex - 1
    })
    
    get().calculateTotalPrice()
    return true
  },

  redo: () => {
    const state = get()
    if (state.historyIndex >= state.history.length - 1) return false
    
    const nextState = state.history[state.historyIndex + 1]
    
    // Restore Vector3 and Euler objects
    const restoredItems = nextState.items.map((item: any) => ({
      ...item,
      position: new Vector3(item.position.x, item.position.y, item.position.z),
      rotation: new Euler(item.rotation.x, item.rotation.y, item.rotation.z),
      scale: new Vector3(item.scale.x, item.scale.y, item.scale.z)
    }))
    
    set({
      items: restoredItems,
      tankConfig: nextState.tankConfig,
      selectedItem: nextState.selectedItem,
      historyIndex: state.historyIndex + 1
    })
    
    get().calculateTotalPrice()
    return true
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  addItem: (item) => {
    try {
      // Save current state to history before making changes
      get().saveToHistory()
      
      const newItem: ConfiguratorItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      }
      
      console.log('Adding item to store:', newItem)
      
      set((state) => ({ 
        items: [...state.items, newItem] 
      }))
      get().calculateTotalPrice()
      
      console.log('Item added successfully, current items:', get().items.length)
    } catch (error) {
      console.error('Error adding item to store:', error)
    }
  },

  removeItem: (id) => {
    // Save current state to history before making changes
    get().saveToHistory()
    
    set((state) => ({ 
      items: state.items.filter(item => item.id !== id),
      selectedItem: state.selectedItem === id ? null : state.selectedItem
    }))
    get().calculateTotalPrice()
  },

  updateItem: (id, updates) => {
    // Don't save to history - this is for real-time updates during dragging/rotating
    set((state) => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }))
    get().calculateTotalPrice()
  },

  commitChanges: () => {
    // Save current state to history after user finishes an interaction
    get().saveToHistory()
  },

  setTankConfig: (config) => {
    // Save current state to history before making changes
    get().saveToHistory()
    
    set((state) => ({
      tankConfig: { ...state.tankConfig, ...config }
    }))
    get().calculateTotalPrice()
  },

  setSelectedItem: (id) => {
    set({ selectedItem: id })
  },

  setCameraPosition: (position) => {
    set({ cameraPosition: position })
  },

  setCameraTarget: (target) => {
    set({ cameraTarget: target })
  },

  calculateTotalPrice: () => {
    const state = get()
    const itemsTotal = state.items.reduce((total, item) => total + item.price, 0)
    const tankPrice = calculateTankPrice(state.tankConfig)
    set({ totalPrice: itemsTotal + tankPrice })
  },

  clearConfiguration: () => {
    // Save current state to history before clearing
    get().saveToHistory()
    
    set({
      items: [],
      selectedItem: null,
      totalPrice: 0
    })
    get().calculateTotalPrice()
  },

  loadConfiguration: (data) => {
    const items = (data.items || []).map((item: any) => ({
      ...item,
      position: item.position instanceof Vector3 
        ? item.position 
        : new Vector3(item.position?.x || 0, item.position?.y || 1, item.position?.z || 0),
      rotation: item.rotation instanceof Euler 
        ? item.rotation 
        : new Euler(item.rotation?.x || 0, item.rotation?.y || 0, item.rotation?.z || 0),
      scale: item.scale instanceof Vector3 
        ? item.scale 
        : new Vector3(item.scale?.x || 1, item.scale?.y || 1, item.scale?.z || 1)
    }))

    set({
      items,
      tankConfig: data.tankConfig || get().tankConfig,
      selectedItem: null
    })
    get().calculateTotalPrice()
    // Save the loaded state as the first history entry
    get().saveToHistory()
  },

  exportConfiguration: () => {
    const state = get()
    return {
      items: state.items,
      tankConfig: state.tankConfig,
      totalPrice: state.totalPrice,
      timestamp: new Date().toISOString()
    }
  }
}))

function calculateTankPrice(config: TankConfig): number {
  const basePrice = 150
  const volumeMultiplier = (config.width * config.height * config.depth) / 10000
  const glassMultiplier = config.glassType === 'low-iron' ? 1.3 : config.glassType === 'tempered' ? 1.5 : 1
  
  return Math.round(basePrice * volumeMultiplier * glassMultiplier)
}
