'use client';

import { useState, useEffect } from 'react';
import { getPermissions, Permission } from '@/lib/services/users.service';

interface PermissionSelectorProps {
    selectedPermissions: string[];
    onChange: (permissions: string[]) => void;
    disabled?: boolean;
}

export default function PermissionSelector({
    selectedPermissions,
    onChange,
    disabled = false,
}: PermissionSelectorProps) {
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            const data = await getPermissions();
            setPermissions(data);
        } catch (error) {
            console.error('Error loading permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (permissionName: string) => {
        if (disabled) return;

        const newPermissions = selectedPermissions.includes(permissionName)
            ? selectedPermissions.filter(p => p !== permissionName)
            : [...selectedPermissions, permissionName];

        onChange(newPermissions);
    };

    const handleCategoryToggle = (categoryPermissions: Permission[]) => {
        if (disabled) return;

        const categoryPermissionNames = categoryPermissions.map(p => p.name);
        const allSelected = categoryPermissionNames.every(p => selectedPermissions.includes(p));

        if (allSelected) {
            // Deselect all in category
            onChange(selectedPermissions.filter(p => !categoryPermissionNames.includes(p)));
        } else {
            // Select all in category
            const newPermissions = [...selectedPermissions];
            categoryPermissionNames.forEach(p => {
                if (!newPermissions.includes(p)) {
                    newPermissions.push(p);
                }
            });
            onChange(newPermissions);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(permissions).map(([category, categoryPermissions]) => {
                const categoryPermissionNames = categoryPermissions.map(p => p.name);
                const allSelected = categoryPermissionNames.every(p => selectedPermissions.includes(p));


                return (
                    <div key={category} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-foreground capitalize">
                                {category}
                            </h4>
                            <button
                                type="button"
                                onClick={() => handleCategoryToggle(categoryPermissions)}
                                disabled={disabled}
                                className="text-xs text-primary hover:text-primary-hover font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                            </button>
                        </div>
                        <div className="space-y-2">
                            {categoryPermissions.map((permission) => {
                                const isSelected = selectedPermissions.includes(permission.name);
                                return (
                                    <label
                                        key={permission.id}
                                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isSelected
                                            ? 'bg-primary-soft border border-border'
                                            : 'hover:bg-surface-muted border border-transparent'
                                            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handlePermissionToggle(permission.name)}
                                            disabled={disabled}
                                            className="w-4 h-4 text-primary border-border rounded focus:ring-ring focus:ring-2"
                                        />
                                        <span className="text-sm text-foreground">
                                            {permission.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

