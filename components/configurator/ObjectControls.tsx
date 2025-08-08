'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Input } from '../ui/input'
import { useConfiguratorStore } from '../../lib/stores/configurator'
import { Vector3, Euler } from 'three'
import { useState } from 'react'

export function ObjectControls() {
  const { selectedItem, items, updateItem, removeItem } = useConfiguratorStore()
  
  const selectedObject = items.find(item => item.id === selectedItem)
  
  if (!selectedObject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Object Controls</CardTitle>
          <CardDescription>Select an object to edit its properties</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-500">
          <p>Click on any object in the tank to select it and view controls here.</p>
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="font-medium">Controls:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Drag to move objects</li>
              <li>• Ctrl+Drag to resize</li>
              <li>• Double-click to stack</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = new Vector3(
      axis === 'x' ? value : selectedObject.position.x,
      axis === 'y' ? value : selectedObject.position.y,
      axis === 'z' ? value : selectedObject.position.z
    )
    updateItem(selectedObject.id, { position: newPosition })
  }

  const handleScaleChange = (value: number[]) => {
    const scale = value[0]
    updateItem(selectedObject.id, { 
      scale: new Vector3(scale, scale, scale) 
    })
  }

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    const rotation = (value[0] * Math.PI) / 180 // Convert degrees to radians
    const newRotation = new Euler(
      axis === 'x' ? rotation : selectedObject.rotation.x,
      axis === 'y' ? rotation : selectedObject.rotation.y,
      axis === 'z' ? rotation : selectedObject.rotation.z
    )
    updateItem(selectedObject.id, { rotation: newRotation })
  }

  const resetRotation = () => {
    updateItem(selectedObject.id, { 
      rotation: new Euler(0, 0, 0) 
    })
  }

  const handleDelete = () => {
    removeItem(selectedObject.id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Object Controls</CardTitle>
        <CardDescription>Edit properties of {selectedObject.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Object Info */}
        <div className="p-3 bg-blue-50 rounded">
          <p className="font-medium text-sm">{selectedObject.name}</p>
          <p className="text-xs text-gray-600">${selectedObject.price}</p>
        </div>

        {/* Position Controls */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Position</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500">X</label>
              <Input
                type="number"
                value={selectedObject.position.x.toFixed(1)}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                className="h-8 text-xs"
                step="0.5"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Y</label>
              <Input
                type="number"
                value={selectedObject.position.y.toFixed(1)}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                className="h-8 text-xs"
                step="0.5"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Z</label>
              <Input
                type="number"
                value={selectedObject.position.z.toFixed(1)}
                onChange={(e) => handlePositionChange('z', parseFloat(e.target.value) || 0)}
                className="h-8 text-xs"
                step="0.5"
              />
            </div>
          </div>
        </div>

        {/* Scale Control */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Size: {selectedObject.scale.x.toFixed(1)}x</label>
          <Slider
            value={[selectedObject.scale.x]}
            onValueChange={handleScaleChange}
            min={0.2}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Rotation Controls */}
        <div className="space-y-3">
          <label className="text-xs font-medium">Rotation</label>
          
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500">X-Axis (Pitch): {Math.round((selectedObject.rotation.x * 180) / Math.PI)}°</label>
              <Slider
                value={[(selectedObject.rotation.x * 180) / Math.PI]}
                onValueChange={(value) => handleRotationChange('x', value)}
                min={-180}
                max={180}
                step={15}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-500">Y-Axis (Yaw): {Math.round((selectedObject.rotation.y * 180) / Math.PI)}°</label>
              <Slider
                value={[(selectedObject.rotation.y * 180) / Math.PI]}
                onValueChange={(value) => handleRotationChange('y', value)}
                min={0}
                max={360}
                step={15}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-500">Z-Axis (Roll): {Math.round((selectedObject.rotation.z * 180) / Math.PI)}°</label>
              <Slider
                value={[(selectedObject.rotation.z * 180) / Math.PI]}
                onValueChange={(value) => handleRotationChange('z', value)}
                min={-180}
                max={180}
                step={15}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Rotation Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handleRotationChange('y', [((selectedObject.rotation.y * 180) / Math.PI + 90) % 360])}
            >
              Rotate 90°
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => handleRotationChange('y', [((selectedObject.rotation.y * 180) / Math.PI + 180) % 360])}
            >
              Flip 180°
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={resetRotation}
          >
            Reset Rotation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => handleScaleChange([1])}
          >
            Reset Size
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full text-xs"
            onClick={handleDelete}
          >
            Delete Object
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
